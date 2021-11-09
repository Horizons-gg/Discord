var prefix = '.'

const dns = require('dns')

module.exports = function(app, client, mongodb) {

    client.on('messageCreate', async msg => {

        var args = msg.content.toLowerCase().trim().split(' ')

        if (msg.content.toLowerCase() === '!se') {

            var sydney = await dns.promises.lookup('horizons.gg')
            var brisbane = await dns.promises.lookup('au.horizons.gg')

            var embed = {
                "title": "Space Engineers | Network",
                "description": "The following addresses and protocols are used to connect to the Space Engineers Servers.\n**Game must be closed to use Auto Join!**",
                "fields": [
                    { "name": "Modded", "value": `Auto Join: steam://connect/horizons.gg:27016\nDirect Connect: \`${sydney.address}:27016\`` },
                    { "name": "Hardcore", "value": `Auto Join: steam://connect/au.horizons.gg:27018\nDirect Connect: \`${brisbane.address}:27018\`` }
                ],
                "image": {
                    "url": "https://invisioncommunity.co.uk/wp-content/uploads/2021/05/space-engineers.jpg"
                },
                "footer": {
                    "text": `Requested by ${msg.author.tag}`
                }
            }

            msg.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 60000))
            msg.delete()
        }

        if (args[0] === prefix + 'h') {

            if (args[1] === undefined) {
                //msg.author.send()
            }

            if (args[1] === 'ecojoin') {

                var embed = {
                    "title": "Eco - Connecting to our Server",
                    "description": ">>> To join our Eco Server, go to **Your Worlds** then at the top right hit the big **+** button and enter __**horizons.gg**__, this will connect you to our server, do take note that our IP does change every now and then, when this happens you may need to re add our server or connect through **New Game**.\n\nYou can also see the current status of the server under the through the <@777312116482899978> bot at the top of the member list which will cycle between players and the time until asteroid impact.\n\nEnjoy playing! 😄",
                    "image": {
                        "url": "https://wiki.play.eco/images/2/2a/Banner4k.jpg"
                    },
                    "footer": {
                        "text": `Assisted by ${msg.author.tag}`
                    }
                }

                msg.channel.send({ embeds: [embed] })
            }

            if (args[1] === 'eco') {

                var embed = {
                    "title": "Eco - What is Eco?",
                    "description": ">>> Enter the world of Eco, a fully simulated ecosystem bustling with thousands of growing plants and animals living their lives. Build, harvest, and take resources from an environment where your every action affects the world around you. An imminent meteor strike threatens global destruction. Can you save the world without destroying it in the process?\n\nConstruct buildings and towns, tend to your farm, hunt wildlife, build infrastructure and transportation, craft clothing, build power plants, and research new technologies. Specialize in a craft and trade your goods to other players. Develop your civilization and sculpt your planet.\n\nAs your civilization grows, you’ll need to analyze data from the simulation; evaluating the impact you have on your world. Use this data as evidence in proposed laws, restricting harmful activities without disrupting the advancement of technology. Balance your individual needs with the needs of community, all while maintaining the state of the ecosystem. The future of your world is in your hands.\n\nhttps://store.steampowered.com/app/382310/Eco",
                    "image": {
                        "url": "https://cdn.cloudflare.steamstatic.com/steam/apps/382310/extras/Mine_Tailings.gif"
                    },
                    "footer": {
                        "text": `Assisted by ${msg.author.tag}`
                    }
                }

                msg.channel.send({ embeds: [embed] })
            }

            msg.delete()

        }

    })

}