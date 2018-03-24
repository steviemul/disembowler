const visitor = () => {

  return {
    visitor: {
      AssignmentExpression (path) {
        path.remove();
      },
      ArrayExpression (path) {
        path.remove();
      }
    }
  };
};

module.exports = visitor;
