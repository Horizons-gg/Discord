const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')

const ticketData = './database/tickets.json'

const openCatagory = process.env.DISCORD_OPEN
const closedCatagory = process.env.DISCORD_CLOSED

const controller = require('./functions/controller')

const fs = require('fs')

module.exports = function (app, client) {

    client.on('interactionCreate', async interaction => {
        if (!interaction.customId.startsWith('ticket') && !interaction.customId.startsWith('support')) return
        var user = interaction.user
        var guild = interaction.guild

        if (guild.id !== process.env.DISCORD_ID) return

        var openTickets = await guild.channels.cache.get(openCatagory).children.map(channel => channel.id)
        var closedTickets = await guild.channels.cache.get(closedCatagory).children.map(channel => channel.id)

        var dataRAW = JSON.parse(fs.readFileSync(ticketData))
        var data = dataRAW[interaction.message.channel.id]

        if (openTickets.includes(interaction.message.channel.id)) {
            if (interaction.message.id !== data.controls) return

            var ticketOwner = await guild.members.fetch(data.owner)

            //if (reaction.emoji.name === '🔧') return controller.openTicket(ticketOwner, reaction, data, dataRAW, guild), reaction.users.remove(user.id)

            if (data.designation === 'new') {
                if (interaction.customId === 'support_cancel') {
                    ticketOwner.send({ embeds: [{ "description": `🚫 Ticket \`#${interaction.message.channel.name}\` has been Cancelled.` }] })

                    delete dataRAW[interaction.message.channel.id]
                    fs.writeFileSync(ticketData, JSON.stringify(dataRAW, null, '\t'))
                    interaction.message.channel.delete()

                    return interaction.deferReply(), interaction.deleteReply()
                }


                if (interaction.customId !== 'support_type') return

                if (interaction.values.includes('general')) {
                    if (ticketOwner.id !== user.id) return user.send("You are not the Ticket Owner.")

                    controller.bulkMessage(ticketOwner, ['Staff'], 'General', interaction, data, dataRAW, guild)
                }
                else if (interaction.values.includes('se')) {
                    if (ticketOwner.id !== user.id) return user.send("You are not the Ticket Owner.")

                    controller.bulkMessage(ticketOwner, ['SE Staff'], 'Space Engineers', interaction, data, dataRAW, guild)
                }
                else if (interaction.values.includes('squad')) {
                    if (ticketOwner.id !== user.id) return user.send("You are not the Ticket Owner.")

                    controller.bulkMessage(ticketOwner, ['SQUAD Staff'], 'Squad', interaction, data, dataRAW, guild)
                }
                else if (interaction.values.includes('eco')) {
                    if (ticketOwner.id !== user.id) return user.send("You are not the Ticket Owner.")

                    controller.bulkMessage(ticketOwner, ['ECO Staff'], 'Eco', interaction, data, dataRAW, guild)
                }
                else if (interaction.values.includes('scum')) {
                    if (ticketOwner.id !== user.id) return user.send("You are not the Ticket Owner.")

                    controller.bulkMessage(ticketOwner, ['SCUM Staff'], 'SCUM', interaction, data, dataRAW, guild)
                }
                else if (interaction.values.includes('mc')) {
                    if (ticketOwner.id !== user.id) return user.send("You are not the Ticket Owner.")

                    controller.bulkMessage(ticketOwner, ['MC Staff'], 'Minecraft', interaction, data, dataRAW, guild)
                }

                interaction.reply({ content: '**Relevant staff members have been notified and will assist you shortly.**', ephemeral: true })

                controller.openTicket(ticketOwner, interaction, data, dataRAW, guild, true)

                await interaction.message.channel.permissionOverwrites.edit(user, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true
                })
            }
            else {
                if (interaction.customId === 'ticket_close') {

                    //interaction.message.channel.setParent(closedCatagory, { lockPermissions: false })
                    interaction.message.channel.edit({ parent: closedCatagory, lockPermissions: false })

                    controller.closeTicket(ticketOwner, interaction, data, dataRAW, guild, true)

                    ticketOwner.send({ embeds: [{ "description": `🔒 Ticket \`#${interaction.message.channel.name}\` has been closed by <@${user.id}>` }] })
                    interaction.message.channel.send({ embeds: [{ "description": `🔒 Ticket has been closed by <@${user.id}>` }] })

                    return interaction.deferReply(), interaction.deleteReply()
                }

                if (interaction.customId === 'ticket_alert') {

                    function msToMinutesAndSeconds(ms) {
                        var minutes = Math.floor(ms / 60000);
                        var seconds = ((ms % 60000) / 1000).toFixed(0);
                        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
                    }

                    if (Date.parse(data.bell) > new Date()) return interaction.reply({ content: `⛔ You cannot notify the Staff Team for ${msToMinutesAndSeconds(Date.parse(data.bell) - new Date())}`, ephemeral: true })

                    var nextTime = new Date()
                    nextTime.setMinutes(nextTime.getMinutes() + 10)
                    data.bell = nextTime


                    interaction.message.channel.send({ content: '@here,', embeds: [{ "description": `🔔 <@${user.id}> is trying to get your attention!` }] })

                    dataRAW[interaction.message.channel.id] = data
                    fs.writeFileSync(ticketData, JSON.stringify(dataRAW, null, '\t'))

                    return interaction.deferReply(), interaction.deleteReply()

                }

                if (interaction.customId === 'ticket_join') {
                    var interactionMember = await guild.members.fetch(user.id)
                    if (!await interactionMember.roles.cache.find(role => role.name === 'Staff')) return user.send({ embeds: [{ "description": `⛔ Only Staff Members can assign them selves to tickets` }] })

                    if (!data.assigned.includes(user.id)) {

                        data.assigned.push(user.id)

                        controller.openTicket(ticketOwner, interaction, data, dataRAW, guild)

                        interaction.message.channel.send({
                            embeds: [{
                                "description": `🦺 <@${user.id}> has joined the ticket`,
                                "thumbnail": {
                                    "url": interactionMember.user.avatarURL() + '?size=64'
                                }
                            }]
                        })

                        dataRAW[interaction.message.channel.id] = data
                        fs.writeFileSync(ticketData, JSON.stringify(dataRAW, null, '\t'))
                    }

                    else {

                        const assignedIndex = data.assigned.indexOf(user.id);
                        if (assignedIndex > -1) {
                            data.assigned.splice(assignedIndex, 1);
                        }

                        controller.openTicket(ticketOwner, interaction, data, dataRAW, guild)

                        interaction.message.channel.send({
                            embeds: [{
                                "description": `❌ <@${user.id}> has withdrawn from the ticket`
                            }]
                        })

                        dataRAW[interaction.message.channel.id] = data
                        fs.writeFileSync(ticketData, JSON.stringify(dataRAW, null, '\t'))

                        return interaction.deferReply(), interaction.deleteReply()
                    }

                    return interaction.deferReply(), interaction.deleteReply()
                }

            }

        }



        if (closedTickets.includes(interaction.message.channel.id)) {
            if (interaction.message.id !== data.controls) return

            var ticketOwner = await guild.members.fetch(data.owner)
            var interactionMember = await guild.members.fetch(user.id)

            if (interaction.customId === 'ticket_open') {
                //interaction.message.channel.setParent(openCatagory, { lockPermissions: false })
                interaction.message.channel.edit({ parent: openCatagory, lockPermissions: false })

                controller.openTicket(ticketOwner, interaction, data, dataRAW, guild, true)

                ticketOwner.send({ embeds: [{ "description": `🔓 Ticket \`#${interaction.message.channel.name}\` has been opened by <@${user.id}>` }] })
                interaction.message.channel.send({ embeds: [{ "description": `🔓 Ticket has been opened by <@${user.id}>` }] })

                return interaction.deferReply(), interaction.deleteReply()
            }
            else if (interaction.customId === 'ticket_delete') {

                var isLeader = await interactionMember.roles.cache.find(role => role.name === "Community Leader")
                var isManager = await interactionMember.roles.cache.find(role => role.name === "Manager")

                if (!isLeader && !isManager) return user.send({ embeds: [{ "description": `⛔ Only Managers & Leaders can Delete Tickets!` }] })

                ticketOwner.send({ embeds: [{ "description": `❌ Ticket \`#${interaction.message.channel.name}\` has been deleted by <@${user.id}>` }] })

                delete dataRAW[interaction.message.channel.id]
                fs.writeFileSync(ticketData, JSON.stringify(dataRAW, null, '\t'))
                return interaction.message.channel.delete()
            }
        }

    });

}