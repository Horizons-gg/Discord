var page = 0

module.exports = function (app) {

    const Discord = require('discord.js');
    const client = new Discord.Client({ intents: ['GUILDS'] });
    const fs = require('fs'), xml2js = require('xml2js');
    var parser = new xml2js.Parser();

    const fetch = require('node-fetch')

    if (!process.env.BOT_FARMING) return
    client.login(process.env.BOT_FARMING);

    client.on('ready', async () => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity(`Scraping Data...`, { type: 'WATCHING' })
        client.user.setStatus('idle')

        async function refresh() {

            fetch('http://farming.horizons.gg:8090/feed/dedicated-server-stats.xml?code=058e2a59bcd686de178691fedae13e98')
                .then(res => res.text())
                .then(body => {
                    parser.parseString(body, (err, data) => {
                        try {
                            if (err) {
                                fs.writeFile(`database/servers/farming.json`, JSON.stringify({}, null, 2), (err) => { if (err) throw err; })
                                client.user.setActivity(`Server Offline`, { type: 'WATCHING' })
                                client.user.setStatus('dnd')
                            }
                            else {
                                fs.writeFile(`database/servers/farming.json`, JSON.stringify(data, null, 2), (err) => { if (err) throw err; })
                                if (page === 0) {
                                    page = 1
                                    if (parseInt(data.Server.Slots[0].$.numUsed) === 0) return client.user.setActivity(`No Players Online`, { type: 'WATCHING' }), client.user.setStatus('idle')
                                    client.user.setActivity(`${data.Server.Slots[0].$.numUsed} / ${data.Server.Slots[0].$.capacity} Players`, { type: 'WATCHING' })
                                    return client.user.setStatus('online')
                                }
                                if (page === 1) {
                                    client.user.setActivity(`${data.Server.$.mapName}`, { type: 'PLAYING' })
                                    return page == 0
                                }

                            }
                        } catch {
                            fs.writeFile(`database/servers/farming.json`, JSON.stringify({}, null, 2), (err) => { if (err) throw err; })
                            client.user.setActivity(`Server Offline`, { type: 'WATCHING' })
                            client.user.setStatus('dnd')
                        }
                    })
                })
                .catch(() => {
                    fs.writeFile(`database/servers/farming.json`, JSON.stringify({}, null, 2), (err) => { if (err) throw err; })
                    client.user.setActivity(`Server Offline`, { type: 'WATCHING' })
                    client.user.setStatus('dnd')
                })

                process.data.games[game] = status

        }
        setInterval(refresh, 6000), refresh()

    })
}