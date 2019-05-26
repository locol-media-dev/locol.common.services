"use strict";
const locolModule = __filename.slice(__dirname.length + 1, -3)
const locolLogger = require('locol.common.services/log')(locolModule)                     // Bring in standard logging module
const configMap = require('locol.common.services/configMap').getConfigMap()
const Mocha = require('mocha')
const fs = require('fs')
const path = require('path')

module.exports = (dir) => {
    var mocha = new Mocha();
    var testDir = dir

    // Add each .js file to the mocha instance
    fs.readdirSync(testDir).filter(function (file) {
      return file.substr(-3) === '.js';
    }).forEach(function (file) {
      mocha.addFile(
        path.join(testDir, file)
      );
    });
    mocha.run(function (failures) {
      process.exitCode = failures ? -1 : 0;  // exit with non-zero status if there were failures
    });
  }

