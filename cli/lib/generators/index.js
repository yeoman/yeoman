

var generators = module.exports;

generators.init = function init(cli) {
  // get back arguments without the generate prefix
  var args = cli.tasks.slice(1),
    name = args.shift();

  if(!name) {
    return generators.help('generate');
  }

  generators.invoke(name, args, cli.options);

};

// show help message with available generators
generators.help = function help(command) {
  console.log('show help message for', command);
};


// Receives a namespace, arguments and the options list to invoke a generator.
// It's used as the default entry point for the generate command.
generators.invoke = function invoke(namespace, args, config) {
  var names = namespace.split(':');

  // XXX findByNamespace, start generator
};
