"use strict";
const locolModule = __filename.slice(__dirname.length + 1, -3)
const locolLogger = require('locol.common.services/log')(locolModule)                     // Bring in standard logging module
const configMap = require('locol.common.services/configMap').getConfigMap()
const Promise = require("bluebird")
const cassandra = require('cassandra-driver')

const options = {
    contactPoints: configMap.system.cassandraURL,
    keyspace: 'cloudHost',
//    protocolOptions: {port:30042}, 
    encoding: {
        map: Map,
        set: Set
    }
}
const client = new cassandra.Client(options);
client.connect(function (err) {
    if (err) {
        locolLogger.error('Cassandra Connect error: ' + err)
    }
});


module.exports = () => {
    return (client)
}
