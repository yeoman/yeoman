/*
 RequireJS domReady 1.0.0 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
define(function(){function k(a){for(var b=0,c;c=a[b];b++)c(f)}function l(){var a=g,b=h;c&&(a.length&&(g=[],k(a)),d.resourcesDone&&b.length&&(h=[],k(b)))}function e(){c||(c=!0,i&&clearInterval(i),l())}function b(a){c?a(f):g.push(a);return b}var j=typeof window!=="undefined"&&window.document,c=!j,f=j?document:null,g=[],h=[],d=requirejs||require||{},m=d.resourcesReady,i;if("resourcesReady"in d)d.resourcesReady=function(a){m&&m(a);a&&l()};j&&(document.addEventListener?(document.addEventListener("DOMContentLoaded",
e,!1),window.addEventListener("load",e,!1)):window.attachEvent&&(window.attachEvent("onload",e),self===self.top&&(i=setInterval(function(){try{document.body&&(document.documentElement.doScroll("left"),e())}catch(a){}},30))),document.readyState==="complete"&&e());b.withResources=function(a){c&&d.resourcesDone?a(f):h.push(a);return b};b.version="1.0.0";b.load=function(a,c,d,e){e.isBuild?d(null):b(d)};return b});
