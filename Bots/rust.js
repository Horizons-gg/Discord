const Gamedig = require('gamedig')
const Discord = require('discord.js')
const client = new Discord.Client({ intents: ['GUILDS'] })

var status = {}

function Start(token, game) {
    client.login(token)

    client.on('ready', async() => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity(`Collecting Data...`, { type: 'WATCHING' })
        client.user.setStatus('idle')

        function refresh() {

            process.data.games[game] = status

            Gamedig.query({
                type: 'rust',
                host: 'horizons.gg',
                maxAttempts: 3,
                socketTimeout: 3000,
                port: 28015
            }).then((body) => {
                status = body
                if (body.raw.numplayers > 0) {
                    client.user.setActivity(`${body.raw.numplayers} / ${body.maxplayers} Players`, { type: 'WATCHING' })
                    client.user.setStatus('online')
                } else {
                    client.user.setActivity(`No Players Online`, { type: 'WATCHING' })
                    client.user.setStatus('idle')
                }
            }).catch((error) => {
                status = {}
                client.user.setActivity(`Server Offline`, { type: 'WATCHING' })
                client.user.setStatus('dnd')
            })

        }
        setInterval(refresh, 10000)

        process.app.get(`/game/${game}`, (req, res) => {
            res.send(status)
        })

    })
}


module.exports = {
    Start: Start
}