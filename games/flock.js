const Gamedig = require('gamedig')
const Discord = require('discord.js')
const client = new Discord.Client({ intents: ['GUILDS'] })

var status = {}

function Start(token, game) {
    client.login(token)

    client.on('ready', async () => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity(`Collecting Data...`, { type: 'WATCHING' })
        client.user.setStatus('idle')

        function refresh() {
            Gamedig.query({
                type: 'minecraft',
                host: 'au.horizons.gg',
                maxAttempts: 3,
                socketTimeout: 3000,
                port: 25565
            }).then((body) => {
                status = body
                if (body.raw.vanilla.raw.players.online > 0) {
                    client.user.setActivity(`${body.raw.vanilla.raw.players.online} / ${body.raw.vanilla.raw.players.max} Players`, { type: 'WATCHING' })
                    client.user.setStatus('online')
                }
                else {
                    client.user.setActivity(`No Players Online`, { type: 'WATCHING' })
                    client.user.setStatus('idle')
                }
            }).catch(() => {
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