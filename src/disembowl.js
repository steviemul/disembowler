#!/usr/bin/env node
const babel = require('babel-core');

// these are our babel plugin
const comments = require('./babel/comments.js');
const Processor = require('./babel/processor.js');

const fs = require('fs-extra');
const getConfig = require('./require/config.js');

const usage = () => {
  console.info('Usage : disembowl.js <cc_root>');
};

const args = process.argv.slice(2);

if (args.length < 1) {
  usage();
  process.exit(1);
}

const CC_ROOT = args[0];

const requireConfig = getConfig(CC_ROOT + '/commerce/clientutils/config/minify.build.js');

const APP_ROOT = CC_ROOT + '/commerce/Dynamo/Client/Store/web/store.war/';

fs.emptyDirSync('../output/');
fs.ensureDirSync('../output/ast/viewModels');
fs.ensureDirSync('../output/code/viewModels');

const PATHS = {};

const processFile = function (libKey, filename) {

  const stat = fs.statSync(filename);

  if (stat.isFile()) {
    const libContents = fs.readFileSync(filename).toString();
    const processor = new Processor(filename);

    const result = babel.transform(libContents, {
      plugins: [processor.visitor, comments]
    });

    // output our AST and transformed code
    fs.writeFileSync('../output/ast/' + libKey + '.ast.json', JSON.stringify(result.ast, null, 2));
    fs.writeFileSync('../output/code/' + libKey + '.code.js', result.code);
  }
  else if (stat.isDirectory()) {
    PATHS[libKey] = filename;
  }
};

for (const libKey in requireConfig.paths) {
  let filename = APP_ROOT + requireConfig.paths[libKey];

  if (!fs.existsSync(filename)) {
    filename = filename + '.js';
  }

  processFile(libKey, filename);
}
