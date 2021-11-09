var prefix = process.env.DISCORD_PREFIX
const essentials = require('../../functions/essentials.js')
const fs = require('fs')

module.exports = async function (app, client, mongodb) {

    client.on('messageCreate', async msg => {

        var userDb = await mongodb.db("horizons").collection("users")
        var tradeDb = await mongodb.db("horizons").collection("trade")



        var args = msg.content.toLowerCase().trim().split(' ')

        if (args[0] === prefix + 'balance') {
            if (msg.mentions.users.size === 0) {
                var userTrade = await tradeDb.findOne({ '_id': msg.author.id })
                msg.reply(`You have ${essentials.addCommas(userTrade.credits)}cr`)
            } else {
                var userTrade = await tradeDb.findOne({ '_id': msg.mentions.users.first().id })
                msg.channel.send(`<@${msg.mentions.users.first().id}> has ${essentials.addCommas(userTrade.credits)}cr`)
            }
        }

        if (args[0] === prefix + 'materials') {
            if (msg.mentions.users.size === 0) {
                var userTrade = await tradeDb.findOne({ '_id': msg.author.id })
                msg.reply({
                    embeds: [{
                        "title": `${msg.author.username}'s Materials`,
                        "author": {
                            "name": 'Trade Center',
                            "icon_url": msg.author.avatarURL({ dynamic: true }),
                            "url": 'https://www.horizons.gg/trade',
                        },
                        "description": `>>> Copper: ${userTrade.mine_material.copper}\nSilver: ${userTrade.mine_material.silver}\nGold: ${userTrade.mine_material.gold}\nDiamonds: ${userTrade.mine_material.diamond}`,
                        "footer": {
                            "text": `Balance: ${essentials.addCommas(userTrade.credits)}cr`
                        }
                    }]
                })
            } else {
                var userTrade = await tradeDb.findOne({ '_id': msg.mentions.users.first().id })
                msg.channel.send({
                    embeds: [{
                        "title": `${msg.mentions.users.first().username}'s Materials`,
                        "author": {
                            "name": 'Trade Center',
                            "icon_url": msg.mentions.users.first().avatarURL({ dynamic: true }),
                            "url": 'https://www.horizons.gg/trade',
                        },
                        "description": `>>> Copper: ${userTrade.mine_material.copper}\nSilver: ${userTrade.mine_material.silver}\nGold: ${userTrade.mine_material.gold}\nDiamonds: ${userTrade.mine_material.diamond}`,
                        "footer": {
                            "text": `Balance: ${essentials.addCommas(userTrade.credits)}cr`
                        }
                    }]
                })
            }
        }



        /*if (args[0] === prefix + 'sound') {
            const { joinVoiceChannel } = require('@discordjs/voice')

            var tradeData = await tradeDb.findOne({ '_id': msg.author.id })
            if (tradeData.credits < 25) return msg.reply(`It costs 25cr to use this command, you have ${essentials.addCommas(tradeData.credits)}cr`)
            
            if (!fs.existsSync(`././sounds/${args[1]}.mp3`)) return msg.reply('This sound does not exist!')

            var channel = client.guilds.cache.get(msg.guild.id).members.cache.get(msg.author.id).voice.channel
            if (!channel) return msg.reply('You are not in a voice channel!')

            tradeDb.updateOne({ "_id": msg.author.id }, { $set: { "credits": tradeData.credits -= 25 } })

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator
            });
            
            channel.join().then(connection => {
                console.log('Connected to Discord')
                var audio = connection.play(`././sounds/${args[1]}.mp3`).on("finish", () => connection.disconnect())
                audio.setVolume(0.2)
            }).catch(err => {
                console.log(err)
            })

            msg.reply(`Purchase Successful! Your new balance is ${essentials.addCommas(tradeData.credits)}cr`)
        }*/



    })

}