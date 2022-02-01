module.exports = function (app) {
    const Gamedig = require('gamedig');
    const Discord = require('discord.js');
    const client = new Discord.Client({ intents: ['GUILDS'] });
    const fs = require('fs');
    const fetch = require('node-fetch')

    if (!process.env.BOT_RS2) return
    client.login(process.env.BOT_RS2)

    client.on('ready', async () => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity(`Collecting Data...`, { type: 'WATCHING' })
        client.user.setStatus('idle')

        async function refresh() {

            try {
                var res = await fetch(`https://www.battlemetrics.com/servers/rs2vietnam/4785983`)
                var body = await res.text()
                var players = body.split('<dt>Player count</dt>')[1].split('<dd>')[1].split('</dd>')[0]
                var onlinePlayers = players.split('/')[0]
                var maxPlayers = players.split('/')[1]

                if (isNaN(onlinePlayers)) {
                    fs.writeFile(`database/servers/rs2.json`, JSON.stringify({}, null, 2), (err) => { if (err) throw err; })
                    client.user.setActivity(`Server Offline`, { type: 'WATCHING' })
                    client.user.setStatus('dnd')
                    return
                }

                fs.writeFile(`database/servers/rs2.json`, JSON.stringify({ "onlinePlayers": onlinePlayers, "maxPlayers": maxPlayers }, null, 2), (err) => { if (err) throw err; })
                if (parseInt(onlinePlayers) > 0) {
                    client.user.setActivity(`${onlinePlayers} / ${maxPlayers} Players`, { type: 'WATCHING' })
                    client.user.setStatus('online')
                }
                else {
                    client.user.setActivity(`No Players Online`, { type: 'WATCHING' })
                    client.user.setStatus('idle')
                }

            } catch (e) {
                Gamedig.query({
                    type: 'rs2',
                    host: 'au-syd01.farming.zone',
                    maxAttempts: 3,
                    socketTimeout: 3000,
                    port: 27105
                }).then((body) => {
                    fs.writeFile(`database/servers/rs2.json`, JSON.stringify(body, null, 2), (err) => { if (err) throw err; })
                    if (body.raw.numplayers > 0) {
                        client.user.setActivity(`${body.raw.numplayers} / ${body.maxplayers} Players`, { type: 'WATCHING' })
                        client.user.setStatus('online')
                    }
                    else {
                        client.user.setActivity(`No Players Online`, { type: 'WATCHING' })
                        client.user.setStatus('idle')
                    }
                }).catch((error) => {
                    fs.writeFile(`database/servers/rs2.json`, JSON.stringify({}, null, 2), (err) => { if (err) throw err; })
                    client.user.setActivity(`Server Offline`, { type: 'WATCHING' })
                    client.user.setStatus('dnd')
                });
            }

            setTimeout(refresh, 1000 * 120)
        }
        refresh()

    })
}