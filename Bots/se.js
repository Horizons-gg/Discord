let mode = 0

const Gamedig = require('gamedig')
const Discord = require('discord.js')
const client = new Discord.Client({ intents: ['GUILDS'] })

const Sectors = [
    "horizons.gg:27030",
    "au.horizons.gg:27031",
    "au.horizons.gg:27032",
    "au.horizons.gg:27033",
    "au.horizons.gg:27034",

    "de.horizons.gg:27015",
    "de.horizons.gg:27016",
    "de.horizons.gg:27017",
    "de.horizons.gg:27018",
    "de.horizons.gg:27019",

    "us.horizons.gg:27015",
    "us.horizons.gg:27016",
    "us.horizons.gg:27017",
    "us.horizons.gg:27018",
    "us.horizons.gg:27019"

]

let status = {}
let players = 0
let online = 0

function Start(token, game) {
    client.login(token)

    client.on('ready', async() => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity(`Collecting Data...`, { type: 'WATCHING' })
        client.user.setStatus('idle')

        async function refresh() {

            process.data.games[game] = status

            if (mode === 0) {
                mode = 1

                players = 0
                online = 0

                for (sector of Sectors) {
                    const Data = await Query(sector.split(':')[0], parseInt(sector.split(':')[1]))
                    if (Data) online++, players += Data.players.length

                    status[sector] = Data
                }

                client.user.setActivity(`${online} / ${Sectors.length} Sectors Online`, { type: 'WATCHING' })

                if (online === Sectors.length) client.user.setStatus('online')
                if (online < Sectors.length && online > 0) client.user.setStatus('idle')
                else client.user.setStatus('dnd')

                return setTimeout(refresh, 1000 * 5)
            }

            if (mode === 1) {
                mode = 0

                client.user.setActivity(`${players} / 200 Players`, { type: 'WATCHING' })

                return setTimeout(refresh, 1000 * 5)
            }

        }
        refresh()

        process.app.get(`/game/${game}`, (req, res) => {
            res.send(status)
        })
    })
}

async function Query(address, port) {
    return await Gamedig.query({
        type: 'spaceengineers',
        host: address,
        port: port,
        maxAttempts: 2,
        socketTimeout: 1000
    }).then((body) => body).catch(() => false)
}

module.exports = {
    Start: Start
}