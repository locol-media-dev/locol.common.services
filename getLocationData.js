"use strict";

// Standard Locol module header
const locolModule = __filename.slice(__dirname.length + 1, -3)                // Define module name for logging and debugging
const locolLogger = require('locol.common.services/log')(locolModule)
const moment = require('moment')                     // Bring in standard logging module
const configMap = require('locol.common.services/configMap').getConfigMap()
//

const request = require('superagent')
const locolKafkaListener = require('locol.common.services/locolKafkaListener')

var semaphore = require('semaphore')(1);

const $$ = this

const arrayToObject = (array, keyField) =>
    array.reduce((obj, item) => {
        obj[item[keyField]] = item
        return obj
    }, {})

const getLocationDataFromSource = async () => {
    try {
        let response = await request.get(configMap.system.locationDataURL)
            $$.blogAssignments = arrayToObject(response.body.blogAssignments, "blogAssignment")
            $$.authorLocations = arrayToObject(response.body.authorLocations, "authorLocation")
            let locationNameByID = new Map()
            for (let location in $$.authorLocations) {
                locationNameByID.set($$.authorLocations[location].locationID,$$.authorLocations[location].authorDisplayName)
            }
            $$.locationNameByID = locationNameByID
    }
    catch (e) {
        console.error(e)
    }

}

const getLocationDataFrom = (playlistID) => {
    try {
            if (playlistID) {
                let x = $$.locationNameByID.get(playlistID)
                return x
                   
                
            }
            else {
                return {
                    blogAssignments: $$.blogAssignments,
                    authorLocations: $$.authorLocations
                }
            }
    }
    catch (e) {
        console.error(e)
    }
}

const debounce = (func, wait, immediate) => {
    var timeout;
    return () => {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};




module.exports = {
    init: async () => {
        await getLocationDataFromSource() // do a first call to init data
        let debounced = debounce(async () => {
            await getLocationDataFromSource();
        }, 5000);
        let dataHandler = (messageSet, topic, partition) => {
            messageSet.forEach(function (m) {
                console.log(topic, partition, m.offset, m.message.value.toString('utf8'));
                debounced()
            });
        };
        //locolKafkaListener(dataHandler,'locol.content.portal.changes','locol.monitor.service')
    },
    getLocationData: () => getLocationDataFrom()
    ,
    getLocationDataByPlaylistID: (playlistID) => getLocationDataFrom(playlistID)

}