const Discord = require('discord.js')
const client = new Discord.Client({ intents: ['GUILDS'] })
const fetch = require('node-fetch')

var status = {}

function Start(token, game) {
    client.login(token)

    client.on('ready', async () => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity(`Scraping Data...`, { type: 'WATCHING' })
        client.user.setStatus('idle')

        async function refresh() {

            process.data.games[game] = status

            try {
                var res = await fetch(`https://www.battlemetrics.com/servers/scum/12949331`)
                var body = await res.text()
                var players = body.split('<dt>Player count</dt>')[1].split('<dd>')[1].split('</dd>')[0]
                var onlinePlayers = players.split('/')[0]
                var maxPlayers = players.split('/')[1]

                status = {
                    players: onlinePlayers,
                    max: maxPlayers
                }

                if (isNaN(onlinePlayers)) {
                    client.user.setActivity(`Server Offline`, { type: 'WATCHING' })
                    client.user.setStatus('dnd')
                    return
                }

                if (parseInt(onlinePlayers) > 0) {
                    client.user.setActivity(`${onlinePlayers} / ${maxPlayers} Players`, { type: 'WATCHING' })
                    client.user.setStatus('online')
                }
                else {
                    client.user.setActivity(`No Players Online`, { type: 'WATCHING' })
                    client.user.setStatus('idle')
                }

            } catch (e) {
                console.log(e)
                client.user.setActivity(`Failed to Scrape Data`, { type: 'WATCHING' })
                client.user.setStatus('dnd')
            }

        }
        setInterval(refresh, 60000)

        process.app.get(`/game/${game}`, (req, res) => {
            res.send(status)
        })

    })
}


module.exports = {
    Start: Start
}