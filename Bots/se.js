const Gamedig = require('gamedig')
const Discord = require('discord.js')
const client = new Discord.Client({ intents: ['GUILDS'] })

var status = {}

function Start(token, game) {

    function refresh() {
        process.data.games[game] = status

        Gamedig.query({
            type: 'spaceengineers',
            host: 'horizons.gg',
            maxAttempts: 3,
            socketTimeout: 3000,
            port: 27016
        }).then((body) => {
            status = body
        }).catch((err) => {
            status = {}
        })

    }
    setInterval(refresh, 10000)

    process.app.get(`/game/${game}`, (req, res) => {
        res.send(status)
    })
}


module.exports = {
    Start: Start
}