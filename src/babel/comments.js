const visitor = (babel) => {
  const t = babel.types;

  return {
    visitor: {
      Program (path) {
        path.traverse({
          enter (path) {
            t.removeComments(path.node);
          }
        });
      }
    }
  };
};

module.exports = visitor;
