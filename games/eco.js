const Discord = require('discord.js')
const client = new Discord.Client({ intents: ['GUILDS'] })
const fetch = require('node-fetch')

var switcher = false
var status = {}


function Start(token, game) {
    client.login(token)

    client.on('ready', async () => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity(`Collecting Data...`, { type: 'WATCHING' })
        client.user.setStatus('idle')

        function refresh() {

            process.data.games[game] = status

            if (!switcher) {
                switcher = true

                fetch('http://horizons.gg:3001/info')
                    .then(res => res.json())
                    .then(body => {
                        status = body
                        if (body.OnlinePlayers > 0) {
                            client.user.setActivity(`${body.OnlinePlayers} / ${body.TotalPlayers} Players`, { type: 'WATCHING' })
                            client.user.setStatus('online')
                        }
                        else {
                            client.user.setActivity(`No Players Online`, { type: 'WATCHING' })
                            client.user.setStatus('idle')
                        }
                    })
                    .catch(() => {
                        status = {}
                        client.user.setActivity(`Server Offline`, { type: 'WATCHING' })
                        client.user.setStatus('dnd')
                    })
            }
            else {
                switcher = false

                fetch('http://horizons.gg:3001/info')
                    .then(res => res.json())
                    .then(body => {
                        status = body

                        var age_seconds = body.TimeLeft
                        var age_minutes = 0
                        var age_hours = 0
                        var age_days = 0

                        while (age_seconds >= 60) {
                            age_minutes += 1;
                            age_seconds -= 60;
                        };

                        while (age_minutes >= 60) {
                            age_hours += 1;
                            age_minutes -= 60;
                        };

                        while (age_hours >= 24) {
                            age_days += 1;
                            age_hours -= 24;
                        };

                        client.user.setActivity(`Impact in ${age_days}d, ${age_hours}h`, { type: 'WATCHING' })
                    })
                    .catch(() => {
                        status = {}
                        client.user.setActivity(`Server Offline`, { type: 'WATCHING' })
                        client.user.setStatus('dnd')
                    })
            }

        }
        setInterval(refresh, 6000)

        process.app.get(`/game/${game}`, (req, res) => {
            res.send(status)
        })
    })
}


module.exports = {
    Start: Start
}