
const visitor = (babel) => {
  const t = babel.types;

  return {
    visitor: {
      ExpressionStatement (path) {

        const node = path.node;
        const expression = node.expression;

        if  (t.isAssignmentExpression(expression)) {
          if (expression.operator === '=') {
            console.info('hit ?');

            if (expression.left && expression.left.object && expression.left.object.property) {
              console.info('hit ?');
              if (expression.left.object.property.name === 'prototype') {
                console.info('hit ?');
                if (expression.left.property && expression.left.property.name === 'balls') {
                  path.remove();
                }
              }
            }
          }
        }

      }
    }
  };
};

module.exports = visitor;
