const removals = require('../helpers/bindingsRemoval.js');

const visitor = () => {

  return {
    visitor: Object.assign({}, removals.removeUnusedBindings())
  };
};

module.exports = visitor;
