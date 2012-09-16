require('shelljs/global');
var os = require('os');
var sys = require('sys');

var osType = os.type();
var installed = [];
var notInstalled = [];

var deps = {
  curl: {
    ver: '',
    name: 'curl',
    happy: '',
    sad: '',
    desc: ''
  },
  git: {
    ver: '',
    name: 'git',
    happy: 'is installed, nice one.',
    sad: '',
    desc: 'Install through your package manager.\n\tFor example with homebrew:',
    cmd: 'brew install git'
  },
  ruby: {
    ver: '1.8',
    name: 'ruby',
    happy: 'is installed.',
    sad: '',
    desc: 'Check your ruby with',
    cmd: 'ruby -v',
    extra: '(>= 1.8.7 required) and install http://www.ruby-lang.org/en/downloads/'
  },
  node: {
    ver: '0.8',
    name: 'NodeJS',
    happy: 'is installed.',
    sad: '',
    desc: 'I recommend you grab a fresh NodeJS install (>= 0.8.x) from http://nodejs.org/download/'
  },
  compass: {
    ver: '0.12',
    name: 'Compass',
    happy: 'is installed.',
    sad: '',
    desc: 'is not installed: http://compass-style.org/install/'
  },
  gem: {
    ver: '',
    name: 'RubyGems',
    happy: 'is installed.',
    sad: '',
    desc: 'You\'ll pick this up with your ruby installation.'
  },
  phantomjs: {
    ver: '',
    name: 'PhantomJS',
    happy: 'is installed.',
    sad: '',
    desc: 'Follow instructions at http://phantomjs.org/download.html - the binary installs are quick!'
  },
  jpegtran: {
    ver: '',
    name: 'jpegtran',
    happy: 'is installed.',
    sad: '',
    desc: 'On Mac,',
    cmd: 'brew install jpeg-turbo && brew link jpeg-turbo',
    extra: 'should do the trick.'
  },
  optipng: {
    ver: '',
    name: 'optipng',
    happy: 'is installed.',
    sad: '',
    desc: 'On Mac,',
    cmd: 'brew install optipng',
    extra: 'will sort you out.'
  },
  clang: {
    ver: '',
    name: 'Command Line Tools for Xcode',
    happy: 'are installed!',
    sad: '',
    desc: 'Visit http://stackoverflow.com/a/9329325/89484 for installation options.'
  },
  brew: {
    ver: '',
    name: 'Homebrew',
    happy: 'is installed.',
    sad: '',
    desc: 'Install Homebrew from the instructions at https://github.com/mxcl/homebrew/wiki/Installation\n' +
          '\tFor best results, after install, be sure to run',
    cmd: 'brew doctor',
    extra: 'and follow the recommendations.'

  },
  yeoman: {
    ver: '',
    name: 'yeoman global npm module',
    happy: '... installed!',
    sad: '',
    desc: 'You\'re missing yeoman!',
    cmd: 'npm install -g yeoman',
    extra: 'will sort you out. You may need sudo.'
  }
};


function happyPrint(dep) {
  echo('\033[32m✓ \033[0m \033[1m' + dep.name + '\033[0m ' + dep.happy);
}

function sadPrint(dep) {
  echo('\033[31m✘ \033[0m \033[1m' + dep.name + '\033[0m ' + dep.sad);
}

function descPrint(dep){
  echo('\t' + dep.desc + '\033[47m\033[0;35m ' + (dep.cmd ? dep.cmd : '') + '\033[0m ' + (dep.extra ? dep.extra : ''));
}


echo('');
echo('Wotcha! Well hi there. ');
echo( 'Thanks for your interest in Yeoman.');
echo('');
echo('Below is a quick audit I\'ve run on your system to see if you have everything you need for Yeoman:\n');


if(osType === 'Linux') {
  //This is Linux so remove Mac deps.
  delete deps.clang;
  delete deps.brew;
}

for(var dep in deps) {
  if (!which(dep)) {
    notInstalled.push(dep);
  }else{
    if(deps[dep].ver){
      var version = exec(dep +' -v', {silent:true}).output;
      if(version < deps[dep].ver){
        notInstalled.push(dep); //  Installed, but version mismatch.
        continue;
      }
    }
    installed.push(dep);
  }
}

for(var i = 0; i < installed.length; i++) {
  happyPrint(deps[installed[i]]);
}

for(var i = 0; i < notInstalled.length; i++) {
  sadPrint(deps[notInstalled[i]]);
  descPrint(deps[notInstalled[i]]);
}

echo('');
echo('Help me out and install anything that\'s missing above. Additional help at http://goo.gl/XoyWI');
echo('');
echo('Once you\'ve ensured all of the above dependencies are present, we can start up Yeoman. Type \033[47m\033[0;35myeoman\033[0m at your prompt to get started.');
echo('');