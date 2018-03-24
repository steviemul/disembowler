module.exports = (args) => {
  const options = {
    clean: true,
    remove: false,
    target: null
  };

  args.forEach((arg) => {

    if (arg === '-c') {
      options.clean = true;
    }
    else if (arg === '-r') {
      options.remove = true;
    }
  });

  if (!args[args.length - 1].startsWith('-')) {
    options.target = args[args.length - 1];
  }

  return options;
};
