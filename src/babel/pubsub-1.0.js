const visitor = (babel) => {
  const t = babel.types;

  return {
    visitor: {
      ObjectProperty (path) {
        path.remove();
      }
    }
  };
};

module.exports = visitor;
