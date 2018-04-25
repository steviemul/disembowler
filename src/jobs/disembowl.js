#!/usr/bin/env node
const babel = require('babel-core');
const glob = require('glob');
const path = require('path');
const fs = require('fs-extra');
const lint = require('./lint.js');

// these are our babel plugin
const comments = require('../babel/comments.js');
const dependencies = require('../babel/dependencies.js');

const IGNORE_PATHS = [
  'js/oraclejet',
  'shared/js/libs'
];

const shouldIgnorePath = (path) => {

  let shouldIgnore = false;

  IGNORE_PATHS.forEach((ignorePath) => {
    if (path.startsWith(ignorePath)) {
      shouldIgnore = true;
    }
  });

  return shouldIgnore;
};

let lineLength = 100;

const processFile = (jsFile, appRoot, outputDir, options, total, index) => {

  const shortName = path.basename(jsFile);

  const libKey = shortName.replace('.js', '');

  const relativePath = jsFile.replace(appRoot, '').replace(shortName, '');

  const libContents = fs.readFileSync(jsFile).toString();
  fs.ensureDirSync(outputDir + '/code/' + relativePath);

  if (shouldIgnorePath(relativePath)) {
    fs.writeFileSync(outputDir + '/code/' + relativePath + libKey + '.js', libContents);

    return;
  }

  const msg = `Processing library (${total - index} remaining) : ${relativePath}${shortName}...`;
  lineLength = (lineLength > msg.length) ? lineLength : msg.length;

  const output = msg + ' '.repeat(lineLength - msg.length);

  process.stdout.write(output + '\r');

  fs.ensureDirSync(outputDir + '/ast/' + relativePath);

  let libPlugin;

  if (options.remove === true) {
    try {
      libPlugin = require('../babel/' + shortName);
    }
    catch (e) {}
  }

  const plugins = [comments, dependencies];

  if (libPlugin) {
    plugins.push(libPlugin);
  }

  const result = babel.transform(libContents, {
    plugins: plugins
  });

    // output our AST and transformed code
  fs.writeFileSync(outputDir + '/ast/' + relativePath + libKey + '.ast.json', JSON.stringify(result.ast, null, 2));
  fs.writeFileSync(outputDir + '/code/' + relativePath + libKey + '.js', lint(result.code));

};

module.exports = (appRoot, outputDir, options) => {

  const jsFiles = glob.sync(appRoot + '/**/*.js');

  jsFiles.forEach((jsFile, index) => {
    processFile(jsFile, appRoot, outputDir, options, jsFiles.length, index);
  });
};
