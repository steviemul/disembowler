const Linter = require('eslint').Linter;
const linter = new Linter();

module.exports = (jsFileContents) => {
  const result = linter.verifyAndFix(jsFileContents, {
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'error'
    }
  });

  return result.output;
};
