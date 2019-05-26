'use strict'

let $$ = this

let initConfigMaps = () => {
    const fs = require('fs');
    const configMapDir = process.env['configMapDir'] ? process.env['configMapDir'] : './configMaps/'
    let config = {};
    let filenames = fs.readdirSync(configMapDir)
    filenames.forEach(function (filename) {
        if (filename.toLowerCase().endsWith('.json')) {
            let content = fs.readFileSync(configMapDir + filename, 'utf-8')
            config[filename.toLowerCase().replace('.json','')] = JSON.parse(content)
        }
    })
    return config
}

module.exports = {
    init: () => {
        $$.configMap = initConfigMaps()
        return $$.configMap
    },
    getConfigMap: () => {
       return $$.configMap 
    },
}
