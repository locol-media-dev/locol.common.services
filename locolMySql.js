"use strict";
const locolModule = __filename.slice(__dirname.length + 1, -3)
const locolLogger = require('locol.common.services/log')(locolModule)                     // Bring in standard logging module
const configMap = require('locol.common.services/configMap').getConfigMap()
//const mysql = require('mysql2/promise')

const mysql = require('promise-mysql')

const $$ = this


//   const connection = await locolMySql.getConnection()
//   let [rows, fields] = await connection.execute('SELECT * FROM `locolRedirects` WHERE `locationID` = ? ', [locationID]);
//   connection.release()


module.exports =
{
    init: async function () {
        $$.connectionPool = mysql.createPool(configMap.system.mySql)
        
    },
    getConnection: async function () {
        let connection = await $$.connectionPool.getConnection()
        return connection
    }
}

