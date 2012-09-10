/**
 * @license hm 0.1.0 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/require-hm for details
 */

/*jslint strict: false, plusplus: false, regexp: false */
/*global require: false, XMLHttpRequest: false, ActiveXObject: false,
  define: false, process: false, window: false */

(function () {

    var fs, getXhr,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],

        exportRegExp = /export\s+([A-Za-z\d\_]+)(\s+([A-Za-z\d\_]+))?/g,
        commentRegExp = /(\/\*([\s\S]*?)\*\/|[^\:]\/\/(.*)$)/mg,
        importModuleRegExp = /module|import/g,
        commaRegExp = /\,\s*$/,
        spaceRegExp = /\s+/,
        quoteRegExp = /['"]/,
        endingPuncRegExp = /[\,\;]\s*$/,
        moduleNameRegExp = /['"]([^'"]+)['"]/,
        braceRegExp = /[\{\}]/g,

        fetchText = function () {
            throw new Error('Environment unsupported.');
        };

    if (typeof window !== "undefined" && window.navigator && window.document) {
        // Browser action
        getXhr = function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else {
                for (i = 0; i < 3; i++) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            if (!xhr) {
                throw new Error("getXhr(): XMLHttpRequest not available");
            }

            return xhr;
        };

        fetchText = function (url, callback) {
            var xhr = getXhr();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function (evt) {
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    callback(xhr.responseText);
                }
            };
            xhr.send(null);
        };
    } else if (typeof process !== "undefined" &&
               process.versions &&
               !!process.versions.node) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');
        fetchText = function (path, callback) {
            callback(fs.readFileSync(path, 'utf8'));
        };
    }

    /**
     * Trims any trailing spaces and punctuation so just have a JS string
     * literal, and inserts the hm! loader plugin prefix if necessary. If
     * there is already a ! in the string, then leave it be, unless it
     * starts with a ! which means "use normal AMD loading for this dependency".
     *
     * @param {String} text
     * @returns text
     */
    function cleanModuleName(text) {
        var moduleName = moduleNameRegExp.exec(text)[1],
            index = moduleName.indexOf('!');

        if (index === -1) {
            // Needs the hm prefix.
            moduleName = 'hm!' + moduleName;
        } else if (index === 0) {
            //Normal AMD loading, strip off the ! sign.
            moduleName = moduleName.substring(1);
        }

        return "'" + moduleName + "'";
    }

    /**
     * Expands things like
     * import { draw: drawShape } from shape
     * to be variable assignments.
     */
    function expandImportRefs(moduleMap, text, moduleName) {
        //Strip off the curly braces
        text = text.replace(braceRegExp, '');

        //Split by commas
        var parts = text.split(','),
            modifiedText = '',
            stars = [],
            hasQuotes = quoteRegExp.test(moduleName),
            stringLiteralName = hasQuotes ? moduleName : moduleMap[moduleName],
            colonParts, i, part;

        stringLiteralName = stringLiteralName.substring(1, stringLiteralName.length - 1);

        if (parts[0] === '*') {
            //Strip the quotes from the string name and put it in the stars
            stars.push(stringLiteralName);

            //Put in placeholder in module text to replace later once
            //module is fetched.
            modifiedText = '/*IMPORTSTAR:' + stringLiteralName + '*/';
        } else {
            for (i = 0; (part = parts[i]); i++) {
                colonParts = part.split(':');

                //Normalize foo to be foo:foo
                colonParts[1] = colonParts[1] || colonParts[0];

                modifiedText += 'var ' + colonParts[1] + ' = ' +
                    (hasQuotes ? 'require(' + moduleName + ')' : moduleName) +
                    '.' + colonParts[0] + ';';
            }
        }

        return {
            stars: stars,
            text: modifiedText
        };
    }

    function transformText(moduleMap, type, text) {
        //Strip off the "module" or "import"
        text = text.substring(type.length, text.length);

        var modifiedText = '',
            spaceParts = text.split(spaceRegExp),
            stars = [],
            i, j, varName, moduleName, fromIndex, firstChar, propRefs, imports;

        //First find the "at" part.
        for (i = 0; i < spaceParts.length; i++) {

            if(spaceParts[i] === 'at'){
                fromIndex = i;

                //Only handle the foo from 'foo', not module foo {}
                if (type === 'module') {
                    if (fromIndex > 0) {
                        varName = spaceParts[fromIndex - 1];
                        moduleName = cleanModuleName(spaceParts[fromIndex + 1]);
                        modifiedText += 'var ' + varName + ' = ' + 'require(' + moduleName + ');\n';
                        moduleMap[varName] = moduleName;
                    }
                }
            }


            if (spaceParts[i] === 'from') {
                fromIndex = i;

                //Only handle the foo from 'foo', not module foo {}
                if (type === 'module') {
                    if (fromIndex > 0) {
                        varName = spaceParts[fromIndex - 1];
                        moduleName = cleanModuleName(spaceParts[fromIndex + 1]);
                        modifiedText += 'var ' + varName + ' = ' + 'require(' + moduleName + ');\n';
                        moduleMap[varName] = moduleName;
                    }
                } else if (type === 'import') {
                    if (fromIndex > 0) {
                        //Clean up the module name, if a string, do a require() around it.
                        moduleName = spaceParts[fromIndex + 1];
                        if (quoteRegExp.test(moduleName)) {
                            moduleName = cleanModuleName(moduleName);
                        } else {
                            // Strip off any trailing punctuation
                            moduleName = moduleName.replace(endingPuncRegExp, '');
                        }

                        //Find the staring brace or * for the start of the import
                        propRefs = '';
                        for (j = fromIndex - 1; j >= 0; j--) {
                            firstChar = spaceParts[j].charAt(0);
                            if (firstChar === '{' || firstChar === '*') {
                                //Property refs.
                                propRefs = spaceParts.slice(j, fromIndex).join('');
                                imports = expandImportRefs(moduleMap, propRefs, moduleName);
                                if (imports.stars && imports.stars.length) {
                                    stars = stars.concat(imports.stars);
                                }
                                modifiedText += imports.text;
                                break;
                            }
                        }
                    }
                }
            }
        }

        //console.log('TEXT: ' + text + '\nMODIFIED: ' + modifiedText);

        return {
            stars: stars,
            text: modifiedText
        };
    }


    function compile(text, config) {
        var stars = [],
            moduleMap = {},
            transforms = {},
            currentIndex = 0,
            //Remove comments from the text to be scanned
            scanText = text.replace(commentRegExp, ""),
            transformInputText, transformedText,
            startIndex, segmentIndex, match, tempText, transformed;

        //Reset regexp to beginning of file.
        importModuleRegExp.lastIndex = 0;

        while ((match = importModuleRegExp.exec(scanText))) {
            //Just make the match the module or import string.
            match = match[0];

            startIndex = segmentIndex = importModuleRegExp.lastIndex - match.length;

            while (true) {
                //Find the end of the current set of statements.
                segmentIndex = scanText.indexOf('\n', segmentIndex);
                if (segmentIndex === -1) {
                    //End of the file. Consume it all.
                    segmentIndex = scanText.length - 1;
                    break;
                } else {
                    //Grab the \n in the match.
                    segmentIndex += 1;

                    tempText = scanText.substring(startIndex, segmentIndex);

                    //If the tempText ends with a ,[whitespace], then there
                    //is still more to capture.
                    if (!commaRegExp.test(tempText)) {
                        break;
                    }
                }
            }


            transformInputText = scanText.substring(startIndex, segmentIndex);
            if (!transforms[transformInputText]) {
                transformed = transformText(moduleMap, match, transformInputText);
                transforms[transformInputText] = transformed.text;

                if (transformed.stars && transformed.stars.length) {
                    stars = stars.concat(transformed.stars);
                }
            }

            importModuleRegExp.lastIndex = currentIndex = segmentIndex;
        }

        //Apply the text transforms
        transformedText = text;
        for (transformInputText in transforms) {
            if (transforms.hasOwnProperty(transformInputText)) {
                transformedText = transformedText.replace(transformInputText, transforms[transformInputText]);
            }
        }

        //Convert export calls. Supported:
        //export var foo -> exports.foo
        //export function foo(){} -> exports.foo = function(){}
        //export varName -> exports.varName = varName
        transformedText = transformedText.replace(exportRegExp, function (match, varOrFunc, spacePlusName, name) {
            if (!name) {
                //exposing a local variable as an export value, where
                //its value was assigned before the export call.
                return 'exports.' + varOrFunc + ' = ' + varOrFunc;
            } else if (varOrFunc === 'var') {
                return 'exports.' + name;
            } else if (varOrFunc === 'function') {
                return 'exports.' + name + ' = function ' + name;
            } else {
                return match;
            }
        });

        //?? export x (not with var or named function) means setting export
        //value for whole module?

        //console.log("INPUT:\n" + text + "\n\nTRANSFORMED:\n" + transformedText);
        return {
            text: "define(function (require, exports, module) {\n" +
                  transformedText +
                  '\n});',
            stars: stars
        };
    }

    function finishLoad(require, load, name, text) {
        load.fromText(name, text);

        //Give result to load. Need to wait until the module
        //is fully parsed, which will happen after this
        //execution.
        require([name], function (value) {
            load(value);
        });
    }

    define({
        version: '0.1.0',

        load: function (name, require, load, config) {
            var path = require.toUrl(name + '.hm');
            fetchText(path, function (text) {
                var result = compile(text, config.hm);
                //Do initial transforms.
                text = result.text;

                //IE with conditional comments on cannot handle the
                //sourceURL trick, so skip it if enabled.
                /*@if (@_jscript) @else @*/
                if (!config.isBuild) {
                    text += "\r\n//@ sourceURL=" + path;
                }
                /*@end@*/

                if (result.stars && result.stars.length) {
                    //First load any imports that require recursive analysis
                    //TODO: this will break if there is a circular
                    //dependency with each file doing an import * on each other.
                    require(result.stars, function () {
                        var i, star, mod, starText, prop;

                        //Now fix up the import * items for each module.
                        for (i = 0; (star = result.stars[i]); i++) {
                            starText = '';
                            mod = arguments[i];
                            for (prop in mod) {
                                if (mod.hasOwnProperty(prop)) {
                                    starText += 'var ' + prop + ' = require("' + star + '").' + prop + '; ';
                                }
                            }
                            text = text.replace('/*IMPORTSTAR:' + star + '*/', starText);
                        }

                        //console.log("FINAL TEXT:\n" + text);

                        finishLoad(require, load, name, text);
                    });


                } else {
                    finishLoad(require, load, name, text);
                }
            });
        }
    });
}());