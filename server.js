const Discord = require('discord.js')
const fetch = require('node-fetch')

function Start(token, server) {

    const client = new Discord.Client({ intents: ['GUILDS'] })
    client.login(token)

    client.on('ready', async () => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity('Connecting to DS...', { type: 'WATCHING' })
        refresh()
    })

    var page = 0
    var status = {}

    async function refresh() {
        process.data.servers[server] = status

        await fetch(`http://${server}:7010`)
            .then(res => res.json())
            .then(res => {
                status = res

                client.user.setStatus('online')
                if (page === 0) {
                    page = 1
                    client.user.setActivity(`${res.ping}ms to ${res.city || 'City'}`, { type: 'WATCHING' })
                    return
                }
                if (page === 1) {
                    page = 2
                    client.user.setActivity(`${res.cpu}% CPU Usage`)
                    return
                }
                if (page === 2) {
                    page = 0
                    client.user.setActivity(`${res.ramc}GB / ${res.ramx}GB`, { type: 'WATCHING' })
                    return
                }
            })
            .catch(err => {
                status = {}

                client.user.setActivity('Connection Error', { type: 'WATCHING' })
                client.user.setStatus('dnd')
            })

        setTimeout(refresh, 10000)
    }

    process.app.get(`/server/${server}`, (req, res) => {
        res.send(status)
    })
}



module.exports = {
    Start: Start
}