const babel = require('babel-core');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const bindings = new Set();

const visitor = (babel) => {
  const t = babel.types;

  return {
    visitor: {
      ExpressionStatement (path) {

        const node = path.node;
        const expression = node.expression;

        if  (t.isAssignmentExpression(expression)) {

          if (t.isMemberExpression(expression.left.object) && expression.left.object.property.name === 'bindingHandlers') {
            bindings.add(expression.left.property.name);
          }
        }
      }
    }
  };
};

const processFile = (templateFile) => {

  const contents = fs.readFileSync(templateFile).toString();

  bindings.forEach((binding) => {
    if (contents.indexOf(binding) > -1) {
      bindings.delete(binding);
    }
  });
};

const libraries = [
  'shared/js/ccLibs/cc-ko-extensions.js',
  'shared/js/ccLibs/ko-extensions.js',
  'shared/js/ccLibs/cc-ko-extensions.js'
];

const scan = (ccRoot, appRoot) => {

  let lineLength = 100;
  const TEMPLATES_PATTERN = ccRoot + '/commerce/Dynamo/CC/widgets/**/*.template';

  libraries.forEach((library) => {
    const contents = fs.readFileSync(appRoot + library).toString();

    babel.transform(contents, {
      plugins: [visitor]
    });
  });

  const templateFiles = glob.sync(TEMPLATES_PATTERN);
  const total = templateFiles.length;

  templateFiles.forEach((templateFile, index) => {

    const msg = `Scanning templates for  bindings usage (${total - index} remaining)...`;
    lineLength = (lineLength > msg.length) ? lineLength : msg.length;

    const output = msg + ' '.repeat(lineLength - msg.length);

    process.stdout.write(output + '\r');

    processFile(templateFile);

  });

  const outputLocation = path.join(__dirname, '../../../rules/bindings.json');

  const unusedBindings = {
    'unused': [...bindings]
  };

  fs.writeFileSync(outputLocation, JSON.stringify(unusedBindings));
};

module.exports = {
  scan: scan
};
