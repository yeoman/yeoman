
module.exports = function(grunt) {

    // Create a new task for all nest functionality
    grunt.registerTask('nest', 'This triggers the `nest` commands.', function() {

        // Tell grunt this task is asynchronous.
        var done = this.async(),
            exec = require('child_process').exec,
            command = "nest ";

        command += this.args.join(' ');

        function puts(error, stdout, stderr) {

            grunt.log.write('\n\nnest output:\n');
            grunt.log.write(stdout);

            if (error !== null) {
                grunt.log.error(error);
                done(false);
            } else {
                done(true);
            }
        }

        exec(command, puts);
        grunt.log.write('nest package manager, running `' + this.args.join(' ') + '` now...');
    });
};
