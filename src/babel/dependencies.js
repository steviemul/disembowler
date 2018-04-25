
const config = require('../../rules/dependencies.json');
const removals = config.remove;

const isDefine = (t, path) => {

  if (t.isCallExpression(path.parent)) {
    return (path.parent.callee.name === 'define');
  }

  return false;
};

const removeDependencies = (path) => {

  const elements = path.node.elements;

  elements.forEach((item, index, object) => {
    if (item.type === 'StringLiteral' && removals.includes(item.value)) {
      object.splice(index, 1);
    }
  });
};

const isModuleDefinition = (path) => {

  if (path.inList) {

    if (path.container[path.key - 1]) {
      const sibling = path.container[path.key - 1];

      return sibling.isDependencies;
    }
  }

  return false;
};

const visitor = (babel) => {
  const t = babel.types;

  return {
    visitor: {
      ArrayExpression (path) {

        if (isDefine(t, path)) {
          path.node.isDependencies = true;
          removeDependencies(path);
        }

      },

      FunctionExpression (path) {
        if (isModuleDefinition(path)) {
          path.node.params.forEach((item, index, object) => {
            if (removals.includes(item.name)) {
              object.splice(index, 1);
            }
          });
        }
      }
    }
  };
};

module.exports = visitor;
