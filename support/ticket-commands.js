const ticketData = './database/tickets.json'

const prefix = process.env.DISCORD_PREFIX

const controller = require('./functions/controller')

const fs = require('fs')

module.exports = async function (app, client) {

    client.on('message', async (msg) => {

        var dataRAW = JSON.parse(fs.readFileSync(ticketData))
        var data = dataRAW[msg.channel.id]

        if (!dataRAW.hasOwnProperty(msg.channel.id)) return
        if (msg.author.bot) return

        var args = msg.content.trim().toLowerCase().split(' ')

        var exeUser = await msg.guild.members.fetch(msg.author.id)

        try {

            {
                if (args[1] === msg.author.id) return msg.channel.send({ embeds:[{ "description": `<@${msg.author.id}>,\n⛔ You cannot use access commands on yourself!` }] }).then(msg.delete())
                if (args[1] === data.owner) return msg.channel.send({ embeds: [{ "description": `<@${msg.author.id}>,\n⛔ You cannot use access commands the ticket owner!` }] }).then(msg.delete())

                if (args[0] === `${prefix}add`) {

                    var user = await msg.guild.members.fetch(args[1])
                    msg.channel.permissionOverwrites.edit(user, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true
                    })

                    user.send({ embeds: [{ "description": `📩 <@${msg.author.id}> has granted you access to Ticket <#${msg.channel.id}>` }] })
                    msg.channel.send({ embeds: [{ "description": `✅ <@${msg.author.id}> has granted <@${user.id}> access to this Ticket!` }] })

                    msg.delete()
                }

                if (args[0] === `${prefix}remove`) {

                    var user = await msg.guild.members.fetch(args[1])
                    msg.channel.permissionOverwrites.cache.get(user.id).delete()

                    user.send({ embeds: [{ "description": `⛔ <@${msg.author.id}> has revoked your access to Ticket <#${msg.channel.id}>` }] })
                    msg.channel.send({ embeds: [{ "description": `❌ <@${msg.author.id}> has revoked <@${user.id}>'s access to this Ticket!` }] })

                    msg.delete()
                }
            }



            {
                if (args[0] === `${prefix}update`) {

                    if (args[1] === 'general') data.designation = 'General'
                    if (args[1] === 'se') data.designation = 'Space Engineers'
                    if (args[1] === 'squad') data.designation = 'Squad'
                    if (args[1] === 'eco') data.designation = 'Eco'
                    if (args[1] === 'scum') data.designation = 'SCUM'
                    if (args[1] === 'mc') data.designation = 'Minecraft'

                    dataRAW[msg.channel.id] = data
                    fs.writeFileSync(ticketData, JSON.stringify(dataRAW, null, '\t'))

                    var controllerMsg = await msg.channel.messages.fetch(data.controls)

                    msg.channel.send({ embeds: [{ "description": `🎫 <@${msg.author.id}> updated this Ticket's Designation to **${data.designation}**` }] })
                    msg.delete()
                }
            }



            {
                if (args[0] === `${prefix}assign`) {
                    if (!await exeUser.roles.cache.find(role => role.name === 'Community Leader') && !await exeUser.roles.cache.find(role => role.name === 'Manager') && !await exeUser.roles.cache.find(role => role.name === 'Discord Moderator')) return exeUser.send({ embed: { "description": `⛔ Only Discord Mods+ can assign team members to tickets` } })

                    var user = await msg.guild.members.fetch(msg.mentions.users.first())

                    if (data.assigned.includes(user.id)) {

                        msg.channel.send(`<@${msg.author.id}>,`, { embeds: [{ "description": `⛔ <@${user.id}> is already assigned to this Ticket` }] })
                        return msg.delete()

                    }

                    data.assigned.push(user.id)
                    dataRAW[msg.channel.id] = data
                    fs.writeFileSync(ticketData, JSON.stringify(dataRAW, null, '\t'))

                    user.send({ embeds: [{ "description": `🦺 <@${msg.author.id}> has assigned you to Ticket <#${msg.channel.id}>` }] })
                    msg.channel.send(`<@${data.owner}>,`, {
                        embeds: [{
                            "description": `🦺 <@${user.id}> has been assigned to this Ticket`,
                            "thumbnail": {
                                "url": user.user.avatarURL() + '?size=64'
                            }
                        }]
                    })

                    var controllerMsg = await msg.channel.messages.fetch(data.controls)
                    controllerMsg.react('🔧')

                    msg.delete()
                }

                if (args[0] === `${prefix}withdraw`) {
                    if (!await exeUser.roles.cache.find(role => role.name === 'Community Leader') && !await exeUser.roles.cache.find(role => role.name === 'Manager')) return exeUser.send({ embed: { "description": `⛔ Only Managers+ can assign team members to tickets` } })

                    var user = await msg.guild.members.fetch(msg.mentions.users.first())

                    if (!data.assigned.includes(user.id)) {
                        msg.channel.send(`<@${msg.author.id}>,`, { embeds: [{ "description": `⛔ <@${user.id}> isn't assigned to this Ticket` }] })
                        return msg.delete()

                    }

                    const assignedIndex = data.assigned.indexOf(user.id);
                    if (assignedIndex > -1) {
                        data.assigned.splice(assignedIndex, 1);
                    }
                    dataRAW[msg.channel.id] = data
                    fs.writeFileSync(ticketData, JSON.stringify(dataRAW, null, '\t'))

                    user.send({ embeds: [{ "description": `❌ <@${msg.author.id}> has withdrawn you from Ticket <#${msg.channel.id}>` }] })
                    msg.channel.send({
                        embeds: [{
                            "description": `❌ <@${user.id}> has been withdrawn from this Ticket`
                        }]
                    })

                    var controllerMsg = await msg.channel.messages.fetch(data.controls)

                    msg.delete()
                }
            }

        } catch (err) {
            return console.log(err), msg.channel.send(`<@${msg.author.id}>,`, { embeds: [{ "description": `⛔ There was an issue with your command, please check what you've typed and try again.` }] }).then(msg.delete())
        }

    });

}