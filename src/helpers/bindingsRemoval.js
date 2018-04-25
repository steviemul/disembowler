const types = require('babel-types');

module.exports = {

  removeUnusedBindings () {
    const config = require('../../rules/bindings.json');
    const unused = config.unused;

    return {
      ExpressionStatement (path) {

        const node = path.node;
        const expression = node.expression;

        if  (types.isAssignmentExpression(expression)) {

          if (types.isMemberExpression(expression.left.object) && expression.left.object.property.name === 'bindingHandlers') {
            const binding = expression.left.property.name;

            if (unused.includes(binding)) {
              path.remove();
            }
          }
        }
      }
    };
  }
};
