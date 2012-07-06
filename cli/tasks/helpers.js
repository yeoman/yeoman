/**
 * Grunt Contrib Helpers
 * Description: help make things consistent across tasks.
 * Contributor: @tkellen
 */

module.exports = function(grunt) {
  // Helper for consistent options key access across contrib tasks.
  grunt.registerHelper("options", function(data, defaults) {
    var _ = grunt.utils._;
    var namespace = data.nameArgs.split(":");
    var task = grunt.config(_.flatten([namespace, "options"]));
    var global_subtask = namespace.length > 1 ? grunt.config(_.flatten(["options", namespace])) : {};
    var global = grunt.config(["options", namespace[0]]);

    return _.defaults({}, task, global_subtask, global, defaults || {});
  });
};