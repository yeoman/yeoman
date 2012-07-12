/**
 * @license hm 0.2.0 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/require-hm for details
 */

/*jslint plusplus: true, regexp: true */
/*global require, XMLHttpRequest, ActiveXObject, define, process, window,
console */

define(['esprima', 'module'], function (esprima, module) {
    'use strict';

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
        startQuoteRegExp = /^['"]/,
        braceRegExp = /[\{\}]/g,
        buildMap = {},

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
     * Helper function for iterating over an array. If the func returns
     * a true value, it will break out of the loop.
     */
    function each(ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    /**
     * Cycles over properties in an object and calls a function for each
     * property value. If the function returns a truthy value, then the
     * iteration is stopped.
     */
    function eachProp(obj, func) {
        var prop;
        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (func(obj[prop], prop)) {
                    break;
                }
            }
        }
    }

    /**
     * Inserts the hm! loader plugin prefix if necessary. If
     * there is already a ! in the string, then leave it be, and if it
     * starts with a ! it means "use normal AMD loading for this dependency".
     *
     * @param {String} id
     * @returns id
     */
    function cleanModuleId(id) {
        id = moduleNameRegExp.exec(id)[1];
        var index = id.indexOf('!');

        if (index === -1) {
            // Needs the hm prefix.
            id = 'hm!' + id;
        } else if (index === 0) {
            //Normal AMD loading, strip off the ! sign.
            id = id.substring(1);
        }

        return id;
    }

    function convertImportSyntax(tokens, start, end, moduleTarget) {
        var token = tokens[start],
            cursor = start,
            replacement = '',
            localVars = {},
            moduleRef,
            moduleId,
            star,
            currentVar;

        //Convert module target to an AMD usable name. If a string,
        //then needs to be accessed via require()
        if (startQuoteRegExp.test(moduleTarget)) {
            moduleId = cleanModuleId(moduleTarget);
            moduleRef = 'require("' + moduleId + '")';
        } else {
            moduleRef = moduleTarget;
        }

        if (token.type === 'Punctuator' && token.value === '*') {
            //import * from z
            //If not using a module ID that is a require call, then
            //discard it.
            if (moduleId) {
                star = moduleId;
                replacement = '/*IMPORTSTAR:' + star + '*/\n';
            } else {
                throw new Error('import * on local reference ' + moduleTarget +
                                ' no supported.');
            }
        } else if (token.type === 'Identifier') {
            //import y from z
            replacement += 'var ' + token.value + ' = ' +
                            moduleRef + '.' + token.value + ';';
        } else if (token.type === 'Punctuator' && token.value === '{') {
            //import {y} from z
            //import {x, y} from z
            //import {x: localX, y: localY} from z
            cursor += 1;
            token = tokens[cursor];
            while (cursor !== end && token.value !== '}') {
                if (token.type === 'Identifier') {
                    if (currentVar) {
                        localVars[currentVar] = token.value;
                        currentVar = null;
                    } else {
                        currentVar = token.value;
                    }
                } else if (token.type === 'Punctuator') {
                    if (token.value === ',') {
                        if (currentVar) {
                            localVars[currentVar] = currentVar;
                            currentVar = null;
                        }
                    }
                }
                cursor += 1;
                token = tokens[cursor];
            }
            if (currentVar) {
                localVars[currentVar] = currentVar;
            }

            //Now serialize the localVars
            eachProp(localVars, function (localName, importProp) {
                replacement += 'var ' + localName + ' = ' +
                                moduleRef + '.' + importProp + ';\n';
            });
        } else {
            throw new Error('Invalid import: import ' +
                token.value + ' ' + tokens[start + 1].value +
                ' ' + tokens[start + 2].value);
        }

        return {
            star: star,
            replacement: replacement
        };
    }

    function convertModuleSyntax(tokens, i) {
        //Converts `foo = 'bar'` to `foo = require('bar')`
        var varName = tokens[i],
            eq = tokens[i + 1],
            id = tokens[i + 2];

        if (varName.type === 'Identifier' &&
                eq.type === 'Punctuator' && eq.value === '=' &&
                id.type === 'String') {
            return varName.value + ' = require("' + cleanModuleId(id.value) + '")';
        } else {
            throw new Error('Invalid module reference: module ' +
                varName.value + ' ' + eq.value + ' ' + id.value);
        }
    }

    function compile(path, text) {
        var stars = [],
            moduleMap = {},
            transforms = {},
            targets = [],
            currentIndex = 0,
            //Remove comments from the text to be scanned
            scanText = text.replace(commentRegExp, ""),
            transformedText = text,
            transformInputText,
            startIndex,
            segmentIndex,
            match,
            tempText,
            transformed,
            tokens;

        try {
            tokens = esprima.parse(text, {
                tokens: true,
                range: true
            }).tokens;
        } catch (e) {
            throw new Error('Esprima cannot parse: ' + path + ': ' + e);
        }

        each(tokens, function (token, i) {
            if (token.type !== 'Keyword') {
                //Not relevant, skip
                return;
            }

            var next = tokens[i + 1],
                next2 = tokens[i + 2],
                next3 = tokens[i + 3],
                cursor = i,
                replacement,
                moduleTarget,
                target,
                convertedImport;

            if (token.value === 'export') {
                // EXPORTS
                if (next.type === 'Keyword') {
                    if (next.value === 'var' || next.value === 'let') {
                        targets.push({
                            start: token.range[0],
                            end: next2.range[0],
                            replacement: 'exports.'
                        });
                    } else if (next.value === 'function' && next2.type === 'Identifier') {
                        targets.push({
                            start: token.range[0],
                            end: next2.range[1],
                            replacement: 'exports.' + next2.value +
                                         ' = function '
                        });
                    } else {
                        throw new Error('Invalid export: ' + token.value +
                                        ' ' + next.value + ' ' + tokens[i + 2]);
                    }
                } else if (next.type === 'Identifier') {
                    targets.push({
                        start: token.range[0],
                        end: next.range[1],
                        replacement: 'exports.' + next.value +
                                     ' = ' + next.value
                    });
                } else {
                    throw new Error('Invalid export: ' + token.value +
                                        ' ' + next.value + ' ' + tokens[i + 2]);
                }
            } else if (token.value === 'module') {
                // MODULE
                // module Bar = "bar.js";
                replacement = 'var ';
                target = {
                    start: token.range[0]
                };

                while (token.value === 'module' || (token.type === 'Punctuator'
                        && token.value === ',')) {
                    cursor = cursor + 1;
                    replacement += convertModuleSyntax(tokens, cursor);
                    token = tokens[cursor + 3];
                    //Current module spec does not allow for
                    //module a = 'a', b = 'b';
                    //must end in semicolon. But keep this in case for later,
                    //as comma separators would be nice.
                    //esprima will throw if comma is not allowed.
                    if ((token.type === 'Punctuator' && token.value === ',')) {
                        replacement += ',\n';
                    }
                }

                target.end = token.range[0];
                target.replacement = replacement;
                targets.push(target);
            } else if (token.value === 'import') {
                // IMPORT
                //import * from z;
                //import y from z;
                //import {y} from z;
                //import {x, y} from z;
                //import {x: localX, y: localY} from z;
                cursor = i;
                //Find the "from" in the stream
                while (tokens[cursor] &&
                        (tokens[cursor].type !== 'Identifier' ||
                        tokens[cursor].value !== 'from')) {
                    cursor += 1;
                }

                //Increase cursor one more value to find the module target
                moduleTarget = tokens[cursor + 1].value;
                convertedImport = convertImportSyntax(tokens, i + 1, cursor - 1, moduleTarget);
                replacement = convertedImport.replacement;
                if (convertedImport.star) {
                    stars.push(convertedImport.star);
                }

                targets.push({
                    start: token.range[0],
                    end: tokens[cursor + 3].range[0],
                    replacement: replacement
                });
            }
        });

        //Now sort all the targets, but by start position, with the
        //furthest start position first, since we need to transpile
        //in reverse order.
        targets.sort(function (a, b) {
            return a.start > b.start ? -1 : 1;
        });

        //Now walk backwards through targets and do source modifications
        //to AMD. Going backwards is important since the modifications will
        //modify the length of the string.
        each(targets, function (target, i) {
            transformedText = transformedText.substring(0, target.start) +
                              target.replacement +
                              transformedText.substring(target.end, transformedText.length);
        });

        return {
            text: "define(function (require, exports, module) {\n" +
                  transformedText +
                  '\n});',
            stars: stars
        };
    }

    function finishLoad(require, load, name, transformedText, text, isBuild) {
        //Hold on to the transformed text if a build.
        if (isBuild) {
            buildMap[name] = transformedText;
        }

        load.fromText(name, transformedText);

        if (module.config().logTransform) {
            console.log("INPUT:\n" + text + "\n\nTRANSFORMED:\n" + transformedText);
        }

        //Give result to load. Need to wait until the module
        //is fully parsed, which will happen after this
        //execution.
        require([name], function (value) {
            load(value);
        });
    }

    return {
        version: '0.2.0',

        write: function (pluginName, name, write) {
            if (buildMap.hasOwnProperty(name)) {
                var text = buildMap[name];
                write.asModule(pluginName + "!" + name, text);
            }
        },

        load: function (name, require, load, config) {
            var path = require.toUrl(name + '.hm');
            fetchText(path, function (text) {
                var result = compile(path, text),
                    transformedText = result.text;

                //IE with conditional comments on cannot handle the
                //sourceURL trick, so skip it if enabled.
                /*@if (@_jscript) @else @*/
                if (!config.isBuild) {
                    transformedText += "\r\n//@ sourceURL=" + path;
                }
                /*@end@*/

                if (result.stars && result.stars.length) {
                    //First load any imports that require recursive analysis
                    //TODO: this will break if there is a circular
                    //dependency with each file doing an import * on each other.
                    require(result.stars, function () {
                        var i, star, mod, starText, prop;

                        //Now fix up the import * items for each module.
                        for (i = 0; i < result.stars.length; i++) {
                            star = result.stars[i];
                            starText = '';
                            mod = arguments[i];
                            for (prop in mod) {
                                if (mod.hasOwnProperty(prop)) {
                                    starText += 'var ' + prop + ' = require("' + star + '").' + prop + '; ';
                                }
                            }
                            transformedText = transformedText.replace('/*IMPORTSTAR:' + star + '*/', starText);
                        }

                        finishLoad(require, load, name, transformedText, text, config.isBuild);
                    });
                } else {
                    finishLoad(require, load, name, transformedText, text, config.isBuild);
                }
            });
        }
    };
});
