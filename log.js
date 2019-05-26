'use strict'

const winston = require('winston')
const moment = require('moment')
const configMap = require('locol.common.services/configMap').getConfigMap()

/* const writeToConsoleLog = (msg) => {
    console.log(msg) 
}
const debugLogger = {
    error: writeToConsoleLog,
    debug: writeToConsoleLog,
    warn: writeToConsoleLog,
    info: writeToConsoleLog,
}*/

winston.handleExceptions(new winston.transports.Console) 

module.exports = (module) => {
    if (configMap.app.envMode == "debug") {
        function DebugLogger(module) {
            this.module = module
            this.writeToConsoleLog = function (msg) {
                let consoleLog = {
                    locolService: configMap.app.locolService,
                    module: this.module,
                    msg
                }
                console.log(consoleLog)
            }
            this.debug = this.writeToConsoleLog 
            this.error = this.writeToConsoleLog
            this.warn = this.writeToConsoleLog
            this.info = this.writeToConsoleLog
        }
        let debugLogger = new DebugLogger(module)
        return debugLogger
    }
    else if (configMap.app.envMode == "production") {
        return new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                handleExceptions: true,
                humanReadableUnhandledException: true,
                level: 'debug'
            })
        ],
        rewriters: [(level, msg, meta) => {
            meta.locolService = configMap.app.locolService
            meta.module = module
            //meta.UTCdateTime = moment.utc().format()
            return meta
        }],
        filters: [(level, msg, meta) => {
            return msg + ' |'
        }]
    })
}

}