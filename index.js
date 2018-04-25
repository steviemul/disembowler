#!/usr/bin/env node
const fs = require('fs-extra');

const disembowl = require('./src/jobs/disembowl.js');
const bundle = require('./src/jobs/bundle.js');
const scan = require('./src/jobs/scanner.js');

const getOptions = require('./src/utils/options.js');

const usage = () => {
  console.info('Usage : index.js <opts> <cc_root>');
};

const args = process.argv.slice(2);

if (args.length < 1) {
  usage();
  process.exit(1);
}

const OUTPUT_DIR = './output/';
const options = getOptions(args);

if (options.clean === true) {
  fs.emptyDirSync(OUTPUT_DIR);
}

if (options.target) {
  const CC_ROOT = options.target;

  const APP_ROOT = CC_ROOT + '/commerce/Dynamo/Client/Store/web/store.war/';
  const REQUIRE_JS_CONFIG = CC_ROOT + '/commerce/clientutils/config/minify.build.js';

  scan(CC_ROOT, APP_ROOT);

  fs.emptyDirSync(OUTPUT_DIR);

  disembowl(APP_ROOT, OUTPUT_DIR, options);

  process.stdout.write(' '.repeat(200) + '\r');

  console.info('Running requirejs optimizer on processed libraries.');

  bundle(REQUIRE_JS_CONFIG, OUTPUT_DIR);
}

