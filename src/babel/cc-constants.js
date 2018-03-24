
const visitor = (babel) => {
  const t = babel.types;

  return {
    visitor: {
      ExpressionStatement (path) {

        const node = path.node;
        const expression = node.expression;

        if  (t.isAssignmentExpression(expression)) {

          if (expression.left && expression.left.object && expression.left.object.name === 'CCConstants') {
            if (expression.left.property.name === 'ENDPOINT_GET_CONTAINER_CONFIGURATION') {
              path.remove();
            }
          }
        }

      }
    }
  };
};

module.exports = visitor;
