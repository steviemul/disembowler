const fs = require('fs');

module.exports = function (path) {
  const config = fs.readFileSync(path).toString();

  return eval(config);
};
