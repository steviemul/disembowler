const types = require('babel-types');

module.exports = {
  isDependency (path) {
    if (types.isArrayExpression(path.parent)) {
      if (types.isCallExpression(path.parentPath.parent)) {
        if (path.parentPath.parent.callee.name === 'define') {
          return true;
        }
      }
    }

    return false;
  }
};
