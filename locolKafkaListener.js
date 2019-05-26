"use strict";
const locolModule = __filename.slice(__dirname.length + 1, -3)                // Define module name for logging and debugging
const Promise = require("bluebird")
const kafka = require('kafka-node')
const locolLogger = require('locol.common.services/log')(locolModule)                     // Bring in standard logging module
const configMap = require('locol.common.services/configMap').getConfigMap()
const ConsumerGroup = kafka.ConsumerGroup


module.exports = ( locolKafkaListener,kafkaTopic,locolKafkaConsumerGroup) => {

    const kafkaOptions = {
        kafkaHost: configMap.system.kafkaHost,
        zk: undefined,
        batch: undefined,
        ssl: false,
        groupId: locolKafkaConsumerGroup,
        sessionTimeout: 15000,
        protocol: ['roundrobin'],
        autoCommit: false,
        fromOffset: 'latest',
        commitOffsetsOnFirstJoin: true,
        outOfRangeOffset: 'earliest',
        migrateHLC: false,
        migrateRolling: true
    }
    let client = null
    let producer = null
    let consumerGroup = null
    let errorLogger = null

    if (configMap.system.kafkaHost == "NoKafka") { // create mocks
        producer = {
            sendAsync: (incomingJSON) => {
                return new Promise(() => {
                    locolLogger.debug('locolKafkaListener => Mock sending: ' + JSON.stringify(incomingJSON))
                })

            }
        }
        consumerGroup = {
            commitAsync: () => {
                return new Promise(() => {
                    locolLogger.debug('locolKafkaListener => Mock commiting last msg: whatever it is!')
                })

            }
        }
        errorLogger = (errorItem, errorMsg, who) => {
            let errorBlock = [
                {
                    topic: configMap.system.errorLoggerTopic,
                    messages: {
                        errorItem: errorItem,
                        errorMsg: errorMsg,
                        who: who
                    }
                }
            ];
            locolLogger.debug(JSON.stringify(errorBlock))
        }
        configMap.app.mockNoKafkaData.forEach((message) => {
            locolKafkaListener(message, producer, consumerGroup, errorLogger)
        })
    }
    else {
        client = new kafka.KafkaClient({ kafkaHost: configMap.system.kafkaHost })
        producer = new kafka.HighLevelProducer(client)
        consumerGroup = new ConsumerGroup(kafkaOptions, kafkaTopic)

        errorLogger = (errorItem, errorMsg, who) => {
            let errorBlock = [
                {
                    topic: configMap.system.errorLoggerTopic,
                    messages: {
                        errorItem: errorItem,
                        errorMsg: errorMsg,
                        who: who
                    }
                }
            ];
            producer.sendAsync(errorBlock).then(() => {
            })
        }
        Promise.promisifyAll(producer) // Provide bluebird functions to the Producer functions
        Promise.promisifyAll(consumerGroup) // Provide bluebird functions to the Producer functions

        producer.on('ready', () => {
            consumerGroup.on('message', (message) => {
                locolKafkaListener(message, producer, consumerGroup, errorLogger)
            })
            consumerGroup.on('error', (err) => {
                console.log(err)
            })
        })
    }



}