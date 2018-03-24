
const visitor = (babel) => {
  const t = babel.types;

  return {
    visitor: {
      ExpressionStatement (path) {

        const node = path.node;
        const expression = node.expression;

        if  (t.isAssignmentExpression(expression)) {

          if (expression.left && expression.left.property && expression.left.property.name === 'propertyEditor') {
            path.remove();
          }
        }

      }
    }
  };
};

module.exports = visitor;
