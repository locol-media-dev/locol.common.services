locol.common.services
=====================

This module provides the following functions:
---------------------------------------------
* getLocationData: to get playlist/location meta data
* locolKakfaListener/locolKafkaProducer: to create Kafka listeners and producers on the locol Kafka bus
* locolCassandra: to create a client to access Cassandra data
* log: a function to create log entries
* locolMocha: set up unit testing
* locolMySql: locol_data mySQL wrapper
* configMap: a function to get and share configMap data

To include this module into a locol service
-------------------------------------------
npm install https://github.com/locol-media-dev/locol.common.services.git

Examples of usage of these functions
-------------------------------------------
See locol.monitor.service