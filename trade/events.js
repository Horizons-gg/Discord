const fs = require('fs')

const essentials = require('../../functions/essentials.js')

var eventData = {}

module.exports = async function (app, client, mongodb) {
/*
    function eventCheck() {

        eventData = JSON.parse(fs.readFileSync(`././app/events.json`))

        for (eventType in eventData) {
            if (!Date.parse(eventData[eventType].status.lastRun)) { startEvent(eventType); continue }
            
            var nextRun = new Date(eventData[eventType].status.lastRun)
            nextRun.setHours(nextRun.getHours() + eventData[eventType].frequency)
            console.log(new Date() - nextRun)

            //if ( - new Date(eventData[eventType].status.lastRun))
        }







        setTimeout(eventCheck, 10000)
    } eventCheck()



    function startEvent(eventType) {
        eventData[eventType].status.lastRun = new Date()

        fs.writeFileSync(`././app/events.json`, JSON.stringify(eventData, null, '\t'))
    }
*/
}