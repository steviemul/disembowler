const config = require('../../rules/pubsub.json');
const unused = config.unused;

const visitor = (babel) => {
  const t = babel.types;

  return {
    visitor: {
      ObjectProperty (path) {
        if (t.isIdentifier(path.node.key)) {
          if (unused.includes(path.node.key.name)) {
            path.remove();
          }
        }
      }
    }
  };
};

module.exports = visitor;
