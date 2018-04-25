const babel = require('babel-core');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const topicNames = new Set();

const visitor = (babel) => {
  const t = babel.types;

  return {
    visitor: {
      ObjectProperty (path) {
        if (t.isIdentifier(path.node.key)) {
          topicNames.add(path.node.key.name);
        }
      }
    }
  };
};

const processFile = (jsFile) => {

  const contents = fs.readFileSync(jsFile).toString();

  topicNames.forEach((topicName) => {
    if (contents.indexOf(topicName) > -1) {
      topicNames.delete(topicName);
    }
  });
};

const scan = (ccRoot, appRoot) => {

  let lineLength = 100;

  const contents = fs.readFileSync(appRoot + 'shared/js/ccLibs/pubsub-1.0.js').toString();

  babel.transform(contents, {
    plugins: [visitor]
  });

  const jsFiles = glob.sync(appRoot + '/**/*.js');
  const total = jsFiles.length;

  jsFiles.forEach((jsFile, index) => {

    if (!jsFile.endsWith('pubsub-1.0.js')) {
      const msg = `Scanning libraries for pubsub topicnames usage (${total - index} remaining)...`;
      lineLength = (lineLength > msg.length) ? lineLength : msg.length;

      const output = msg + ' '.repeat(lineLength - msg.length);

      process.stdout.write(output + '\r');

      processFile(jsFile);
    }

  });

  const outputLocation = path.join(__dirname, '../../../rules/pubsub.json');

  const unusedTopicNames = {
    'unused': [...topicNames]
  };

  fs.writeFileSync(outputLocation, JSON.stringify(unusedTopicNames));
};

module.exports = {
  scan: scan
};
