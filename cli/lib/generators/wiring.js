// Wiring.js
// Exposes convenience methods for wiring up markup with scripts,
// stylesheets and other types of dependencies.

var util = require('util'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    path = require('path');

var Wiring = module.exports;

//
// Update a file containing HTML markup with new content, either
// appending, prepending or replacing content matching a particular
// selector
//
// @html    : a string containing HTML markup
// @tagName : a valid CSS selector
// @content : the inline content to update your selector with
// @mode    : a(ppend), p(repend), r(eplace), d(elete)
Wiring.domUpdate = function domUpdate(html, tagName, content, mode){

  $ = cheerio.load(html);

  if(content !== undefined){
    if(mode === 'a'){
      // append
      $(tagName).append(content);
    }else if(mode === 'p'){
      // prepend
      $(tagName).prepend(content);
    }else if(mode === 'r'){
      // replace
      $(tagName).html(content);
    }else if(mode === 'd'){
      $(tagName).remove();
    }
    return $.html();
  }else{
    console.error('Please supply valid content to be updated.');
 }

};


// Insert specific content as the last child of each element matched
// by the tagName selector. Returns a string.
Wiring.append = function append(html, tagName, content){
  return this.domUpdate(html, tagName, content, 'a');
}

// Insert specific content as the first child of each element matched
// by the tagName selector. Returns a string.
Wiring.prepend = function prepend(html, tagName, content){
  return this.domUpdate(html, tagName, content, 'p');
}

// Insert specific content as the last child of each element matched
// by the tagName selector. Writes to file.
Wiring.appendToFile = function appendToFile(path, tagName, content){
	var html = this.readFileAsString(path);
	var updatedContent = this.append(html, tagName, content);
	this.writeFileFromString(path, updatedContent);
}

// Insert specific content as the first child of each element matched
// by the tagName selector. Writes to file.
Wiring.prependToFile = function appendToFile(path, tagName, content){
	var html = this.readFileAsString(path);
	var updatedContent = this.prepend(html, tagName, content);
	this.writeFileFromString(path, updatedContent);
}

// Generate a usemin-handler block
// blockType: js, css
// optimizedPath: the final file to build
// filesBlock: a string containing populated script/style tags ready to be
// injected into a usemin block.
Wiring.generateBlock = function generateBlock(blockType, optimizedPath, filesBlock){
  var blockStart = "\n<!-- build:" + blockType + " " + optimizedPath +" -->\n";
  var blockEnd = "<!-- endbuild -->\n";
  return blockStart + filesBlock + blockEnd;
}

//
// Append files, specifying the optimized path and generating the
// necessary usemin blocks to be used for the build process
// fileType: js (appends to the end of 'body'), css (appends to the end of 'head')
// optimizedPath: the final file to build
// sourceFileList: the list of files to be appended. We check against the fileType to ensure
// the correct tags are wrapped around them and the right usemin blocks generated.
Wiring.appendFiles = function appendFiles(html, fileType, optimizedPath, sourceFileList){

  var files = "", blocks, updatedContent;

  if(fileType === "js"){
  	sourceFileList.forEach(function(n){
   	   files += ('    <script src="' + n + '"></script>\n');
  	});
  	blocks = this.generateBlock('js', optimizedPath, files);
  	updatedContent = this.append(html, 'body', blocks);
  }else if(fileType === "css"){
  	sourceFileList.forEach(function(n){
   	   files += ('    <link rel="stylesheet" href="' + n  + '">\n');
  	});
  	blocks = this.generateBlock('css', optimizedPath, files);
  	updatedContent = this.append(html, 'head', blocks);
  }

  return updatedContent;
}

// Scripts alias to appendFiles
Wiring.appendScripts = function appendScripts(html, optimizedPath, sourceFileList){
	return Wiring.appendFiles(html, 'js', optimizedPath, sourceFileList);
}

// Simple script removal. 
// Todo: establish if Cheerio has workarounds for script selectors
Wiring.removeScript = function removeScript(html, scriptPath){

	// The following is not supported by Cheerio
	// return this.domUpdate(html, "script[src^=" + scriptPath + "]" , "", "d");
	return html.replace(' <script src="' +  scriptPath + '"></script>', "");

}

// Handler for scripts with special usemin needs, such as RequireJS.
Wiring.appendScriptSpecial = function appendScriptSpecial(html, optimizedPath, sourceFile, mode){
	if(mode === "amd"){
		var fileStr = '   <script data-main="app/js/main" src="' + sourceFile  + '"></script>\n';
		var block = Wiring.generateBlock('js', optimizedPath, fileStr);
		return this.append(html, 'body', block);
	}
}

Wiring.appendStyles = function appendStyles(html, optimizedPath, sourceFileList){
	return Wiring.appendFiles(html, 'css', optimizedPath, sourceFileList);
}

// Append a directory of scripts
Wiring.appendScriptsDir = function appendScriptsDir(html, optimizedPath, sourceScriptDir){
  var sourceScriptList = fs.readdirSync(path.resolve(sourceScriptDir));
  return this.appendFiles(html, 'js', optimizedPath, sourceScriptList);
}

// Append a directory of stylesheets
Wiring.appendStylesDir = function appendStylesDir(html, optimizedPath, sourceStyleDir){
  var sourceStlyleList = fs.readdirSync(path.resolve(sourceStyleDir));
  return this.appendFiles(html, 'css', optimizedPath, sourceStyleList);
}

Wiring.readFileAsString = function readFileAsString(filePath){
  return fs.readFileSync(path.resolve(filePath), 'utf8');
}

Wiring.writeFileFromString = function writeFileFromString(html, filePath){
   fs.writeFileSync(path.resolve(filePath), html, 'utf8');
}

