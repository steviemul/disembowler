#!/usr/bin/env node

const requirejs = require('requirejs');
const fs = require('fs-extra');

const optimize = (requireConfig, outputDir) => {

  const configSource = fs.readFileSync(requireConfig).toString();
  const config = eval(configSource);

  config.appDir = outputDir + '/code';
  config.dir = outputDir + '/bundle';
  config.baseUrl = './';
  config.skipDirOptimize = true;
  config.generateSourceMaps = true;
  config.logLevel = 1;

  fs.ensureDirSync(outputDir + '/bundle');

  requirejs.optimize(config, null, function (err) {
    console.error('Error bundling.', err);
  });
};

module.exports = (requireConfig, outputDir) => {
  optimize(requireConfig, outputDir);
};
