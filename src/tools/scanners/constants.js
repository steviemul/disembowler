const babel = require('babel-core');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const constants = new Set();

const visitor = (babel) => {
  const t = babel.types;

  return {
    visitor: {
      ExpressionStatement (path) {

        const node = path.node;
        const expression = node.expression;

        if  (t.isAssignmentExpression(expression)) {

          if (expression.left && expression.left.object && expression.left.object.name === 'CCConstants') {
            constants.add(expression.left.property.name);
          }
        }
      }
    }
  };
};

const processFile = (jsFile) => {

  const contents = fs.readFileSync(jsFile).toString();

  constants.forEach((constant) => {
    if (contents.indexOf(constant) > -1) {
      constants.delete(constant);
    }
  });
};

const scan = (ccRoot, appRoot) => {

  let lineLength = 100;

  const contents = fs.readFileSync(appRoot + 'shared/js/ccLibs/cc-constants.js').toString();

  babel.transform(contents, {
    plugins: [visitor]
  });

  const jsFiles = glob.sync(appRoot + '/**/*.js');
  const total = jsFiles.length;

  jsFiles.forEach((jsFile, index) => {

    if (!jsFile.endsWith('cc-constants.js')) {
      const msg = `Scanning libraries for cc-constants usage (${total - index} remaining)...`;
      lineLength = (lineLength > msg.length) ? lineLength : msg.length;

      const output = msg + ' '.repeat(lineLength - msg.length);

      process.stdout.write(output + '\r');

      processFile(jsFile);
    }

  });

  const outputLocation = path.join(__dirname, '../../../rules/cc-constants.json');

  const unusedConstants = {
    'unused': [...constants]
  };

  fs.writeFileSync(outputLocation, JSON.stringify(unusedConstants));
};

module.exports = {
  scan: scan
};
