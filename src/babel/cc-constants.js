
const config = require('../../rules/cc-constants.json');
const unused = config.unused;

const visitor = (babel) => {
  const t = babel.types;

  return {
    visitor: {
      ExpressionStatement (path) {

        const node = path.node;
        const expression = node.expression;

        if  (t.isAssignmentExpression(expression)) {

          if (expression.left && expression.left.object && expression.left.object.name === 'CCConstants') {
            if (unused.includes(expression.left.property.name)) {
              path.remove();
            }
          }
        }

      }
    }
  };
};

module.exports = visitor;
