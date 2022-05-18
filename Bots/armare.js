const fs = require('fs')
const Discord = require('discord.js')
const client = new Discord.Client({ intents: ['GUILDS'] })

var status = {}

function Start(token, game) {
    client.login(token)

    client.on('ready', async() => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity(`Collecting Data...`, { type: 'WATCHING' })
        client.user.setStatus('idle')

        async function refresh() {

            process.data.games[game] = status

            const OnlinePlayers = await fs.promises.readFile('C:\\Services\\Arma Reforger\\Profile\\console.log', 'utf8')
                .then(data => data.split('\n'))
                .then(data => data.filter(x => x.includes('Players connected:')))
                .then(logs => logs[logs.length - 1].split('connected: ')[1].split(' /')[0])
                .catch(err => console.log(err))

            if (!OnlinePlayers) return client.user.setActivity(`Server Offline`, { type: 'WATCHING' }), client.user.setStatus('dnd'), status = { online: false }

            if (parseInt(OnlinePlayers) > 0) client.user.setActivity(`${OnlinePlayers} / 100 Players`, { type: 'WATCHING' }), client.user.setStatus('online'), { online: true, players: OnlinePlayers }
            else client.user.setActivity(`No Players Online`, { type: 'WATCHING' }), client.user.setStatus('idle'), { online: true, players: OnlinePlayers }

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