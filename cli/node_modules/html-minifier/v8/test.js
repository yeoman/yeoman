load('../src/htmlparser.js');
load('../src/htmlminifier.js');

var input = read('test.html'),
    t1 = new Date(),
    output = minify(input);

print('minified in: ' + (new Date() - t1) + 'ms');