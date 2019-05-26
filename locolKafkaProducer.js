"use strict";
const locolModule = __filename.slice(__dirname.length + 1, -3)
const locolLogger = require('locol.common.services/log')(locolModule)                     // Bring in standard logging module
const configMap = require('locol.common.services/configMap').getConfigMap()
const Promise = require("bluebird")

const kafka = require('kafka-node')
let producer = null
let client = null
let kafkaProducer = null

if (configMap.system.kafkaHost == "NoKafka") {
    producer = {
        sendAsync: (incomingJSON) => {
            return new Promise(() => {
                locolLogger.debug('locolKafkaProducer => Mock sending: ' + JSON.stringify(incomingJSON))
            })
            
        }
    }
}
else {
     client = new kafka.KafkaClient({ kafkaHost: configMap.system.kafkaHost })
     kafkaProducer = new kafka.HighLevelProducer(client)
    Promise.promisifyAll(kafkaProducer) // Provide bluebird functions to the Producer functions
    kafkaProducer.on('error', (err) => {
        locolLogger.error('Error with Kafka Producer: ' + error)
    })
    producer = kafkaProducer
}


module.exports = () => {
    return (producer)
}
