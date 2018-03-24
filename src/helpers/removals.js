const types = require('babel-types');

const safelyRemove = (path, msg) => {

  if  (!path.removed) {
    path.remove();
    // console.info(msg);
  }
};

module.exports = {

  removeFunctionDefinitions (references) {
    return {
      ExpressionStatement (path) {

        const node = path.node;
        const expression = node.expression;

        if  (types.isAssignmentExpression(expression)) {

          ['left', 'right'].forEach((side) => {
            if (expression[side] && expression[side].object && expression[side].object.name === 'self') {
              references.forEach((gut) => {
                if (expression[side].property.name === gut) {
                  try {
                    safelyRemove(path, `Removed definition of ${gut} from self.`);
                  }
                  catch (e) {
                    console.error(`Error removing expression ${gut}`, e);
                  }
                }
              });
            }
          });

          references.forEach((gut) => {
            if (expression.operator === '=') {
              if (expression.left && expression.left.object && expression.left.object.property) {
                if (expression.left.object.property.name === 'prototype') {
                  if (expression.left.property && expression.left.property.name === gut) {
                    safelyRemove(path, `Removed definition of ${gut} from self.`);
                  }
                }
              }
            }
          });

        }
      }
    };
  },

  removeFunctionCalls (references) {
    return {
      CallExpression (path) {

        const node = path.node;

        references.forEach((gut) => {
          if (!types.isAssignmentExpression(path.parent)) {
            if (node.callee.property && node.callee.property.name === gut) {
              try {
                safelyRemove(path, `Removed call to ${gut}`);
              }
              catch (e) {
                console.error(`Error removing call ${gut}`, e);
              }
            }
          }
        });
      }
    };
  }
};
