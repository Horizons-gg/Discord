const Discord = require('discord.js')
const fetch = require('node-fetch')

function Start(token, server) {

    const client = new Discord.Client({ intents: ['GUILDS'] })
    client.login(token)

    client.on('ready', async () => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity('Connecting to DS...', { type: 'WATCHING' })
    })

    var page = 0
    var data = undefined
    var error = undefined

    var status = {}

    function refresh() {

        fetch(`http://${server}:7010`)
            .then(res => res.json())
            .then(json => data = json)
            .catch(err => error = err)

        if (data !== undefined) {
            status = data
        } else {
            status = {}
        }

        if (error !== undefined) {
            client.user.setActivity('Connection Error', { type: 'WATCHING' })
            client.user.setStatus('dnd')
        }

        if (data !== undefined) {
            client.user.setStatus('online')
            if (page === 0) {
                page = 1
                client.user.setActivity(`${data.ping}ms to Sydney`, { type: 'WATCHING' })
                return setTimeout(refresh, 5000), data = undefined, error = undefined
            }
            if (page === 1) {
                page = 2
                client.user.setActivity(`${data.cpu}% CPU Usage`)
                return setTimeout(refresh, 5000), data = undefined, error = undefined
            }
            if (page === 2) {
                page = 0
                client.user.setActivity(`${data.ramc}GB / ${data.ramx}GB`, { type: 'WATCHING' })
                return setTimeout(refresh, 5000), data = undefined, error = undefined
            }
        }
    }
    setInterval(refresh, 5000)

    process.app.get(`/server/${server}`, (req, res) => {
        res.send(status)
    })
}



module.exports = {
    Start: Start
}