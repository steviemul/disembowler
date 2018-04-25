const glob = require('glob');
const path = require('path');

const scan = (ccRoot, appRoot) => {

  const scannersLocation = path.join(__dirname, '../tools/scanners');

  const jsFiles = glob.sync(scannersLocation + '/*.js');

  jsFiles.forEach((jsFile) => {
    const scanner = require(jsFile);

    scanner.scan(ccRoot, appRoot);
  });
};

module.exports = scan;
