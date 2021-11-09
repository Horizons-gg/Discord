var mode = 0

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

        async function refresh() {
            if (mode === 0) {
                mode = 1

                await Gamedig.query({
                    type: 'squad',
                    host: 'horizons.gg',
                    maxAttempts: 3,
                    socketTimeout: 3000
                }).then((body) => {
                    status = body
                    if (body.raw.numplayers > 0) {
                        client.user.setActivity(`${body.raw.numplayers} / ${body.maxplayers} Players`, { type: 'WATCHING' })
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
                });
                return setTimeout(refresh, 1000 * 8)
            }

            if (mode === 1) {
                mode = 2

                await Gamedig.query({
                    type: 'squad',
                    host: 'horizons.gg',
                    maxAttempts: 3,
                    socketTimeout: 3000
                }).then((body) => {
                    status = body
                    if (!body.map.includes('Jensens')) client.user.setActivity(`${body.map.split('_').join(' ')}`, { type: 'COMPETING' })
                    else client.user.setActivity(`Jensens Range`, { type: 'COMPETING' })
                }).catch(() => {
                    status = {}
                    client.user.setActivity(`Server Offline`, { type: 'WATCHING' })
                });
                return setTimeout(refresh, 1000 * 3)
            }

            if (mode === 2) {
                mode = 0

                await Gamedig.query({
                    type: 'squad',
                    host: 'horizons.gg',
                    maxAttempts: 3,
                    socketTimeout: 3000
                }).then((body) => {
                    status = body
                    if (!body.map.includes('Jensens')) client.user.setActivity(`${body.raw.rules.TeamOne_s.split('_').at(-1)} vs ${body.raw.rules.TeamTwo_s.split('_').at(-1)}`, { type: 'WATCHING' })
                    else client.user.setActivity(`${body.map.split('_')[1].split('-').join(' vs ')}`, { type: 'WATCHING' })
                }).catch(() => {
                    status = {}
                    client.user.setActivity(`Server Offline`, { type: 'WATCHING' })
                });
                return setTimeout(refresh, 1000 * 3)
            }

        }
        refresh()

        process.app.get(`/game/${game}`, (req, res) => {
            res.send(status)
        })
    })
}

module.exports = {
    Start: Start
}