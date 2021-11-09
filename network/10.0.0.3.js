const Discord = require('discord.js')
const client = new Discord.Client({ intents: ['GUILDS'] })
const fetch = require('node-fetch')
const fs = require('fs')

module.exports = function (app, main_client, mongodb) {

    if (process.env.DISCORD_ID !== '610606066451087370') return

    client.login(process.env.BOT_CERES);

    client.on('ready', async () => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity('Connecting to DS...', { type: 'WATCHING' })
    })

    var page = 0
    var data = undefined
    var error = undefined
    var custom = undefined

    function refresh() {
        fetch('http://10.0.0.3:7010')
            .then(res => res.json())
            .then(json => data = json)
            .catch(err => error = err)

        if (data !== undefined) {
            fs.writeFileSync('database/network/cache/10.0.0.3.json', JSON.stringify(data, null, '\t'))
        } else {
            fs.writeFileSync('database/network/cache/10.0.0.3.json', JSON.stringify({}, null, '\t'))
        }

        fs.readFile('database/network/10.0.0.3.json', 'utf8', (err, data) => {
            if (err) return console.error(err)
            custom = JSON.parse(data)
        })


        try {
            if (custom.enabled) {
                client.user.setActivity(custom.name, { type: 'WATCHING' })
                client.user.setStatus(custom.status)
                return setTimeout(refresh, 5000), data = undefined, error = undefined
            }
        } catch { }

        if (error !== undefined) {
            client.user.setActivity('Connection Error', { type: 'WATCHING' })
            client.user.setStatus('dnd')
        }

        if (data !== undefined) {

            if (page === 0) {
                page = 1
                client.user.setActivity(`${data.ping}ms to Brisbane`, { type: 'WATCHING' })
                client.user.setStatus('online')
                return setTimeout(refresh, 5000), data = undefined, error = undefined
            }
            if (page === 1) {
                page = 2
                client.user.setPresence({
                    activity: {
                        name: `${data.cpu}% CPU Usage`,
                        type: "WATCHING",
                        url: "https://www.horizons.gg"
                    },
                    status: "online"
                })
                return setTimeout(refresh, 5000), data = undefined, error = undefined
            }
            if (page === 2) {
                page = 0
                client.user.setActivity(`${data.ramc}GB / ${data.ramx}GB`, { type: 'WATCHING' })
                client.user.setStatus('online')
                return setTimeout(refresh, 5000), data = undefined, error = undefined
            }
        }

        setTimeout(refresh, 5000), data = undefined, error = undefined
    }
    refresh()
}