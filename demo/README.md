This is a demo app for the yeoman + express.js integration. It follows http://briantford.com/blog/angular-yeoman.html closely to init a yeoman app with Angular.js

## Instructions
My branch to integrate yeoman and express.js is not officially accepted in yeoman master copy. So to run this example, you will need to manually apply the changes.
### Assume you have installed yeoman@0.9.6 (my change is based on this yeoman version)
1. clone https://github.com/blai/yeoman.git to your local (e.g. `git clone https://github.com/blai/yeoman.git ~/yeoman-blai`)
2. find out where your local yeoman lives (on my Mac, I do `which yeoman`, and follow the symbolic link)
	* For me I have it under `/usr/local/share/npm/lib/node_modules/yeoman`
	* Replace $YEOMAN/tasks/server.js with the same file from my branch (e.g. `~/yeoman-blai/cli/tasks/server.js`)
	* Other way to do this is to point your `/usr/local/share/npm/bin/yeoman` to my branch (e.g. `~/yeoman-blai/cli/bin/yeoman`) 

One you have this done (make sure you also do `npm install` to resolve the express.js dependency), run `yeoman server` from the root of this sample project.
Alternatively, you can do `yeoman server:server/french` to see how you can point to a difference express.js server file at command line



1. Find out where your local yeoman lives using `where yeoman` (e.g `/usr/local/share/npm/lib/node_modules/yeoman`). 
2. Under the tasks directory of your yeoman install, replace `server.js` with `yeoman-custom/cli/tasks/server.js` from this repo.
3. Run `nom install` on your updated yeoman, to resolve the Express.js dependency