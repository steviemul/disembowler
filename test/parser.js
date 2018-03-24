#!/usr/bin/env node
const babel = require('babel-core');
const visitor = require('./visitor.js');

// these are our babel plugin
const fs = require('fs-extra');

const libContents = fs.readFileSync('./target.js').toString();

const result = babel.transform(libContents, {
  plugins: visitor
});

console.log(JSON.stringify(result.ast));
console.log(result.code);
