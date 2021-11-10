const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')

const ticketData = './cache/tickets.json'

var blocked = []

const fs = require('fs')

module.exports = function () {

    process.client.once('ready', async () => {

        var guild = process.client.guilds.cache.get(process.env.guild)
        var ticketChannel = guild.channels.cache.get(process.env.support.channel)

        var embed = {
            title: "<:support:845624848466182164> **Horizons Community Support**",
            description: ">>> The Horizons Staff Team will help you with any issues you may be having.\nMake sure to explain your issue to us and if you want, you can even add other members to the ticket!",
            color: "#3ba55d",
            thumbnail: {
                url: 'https://i.imgur.com/MVGVVBr.png',
            }
        }

        message = await ticketChannel.messages.fetch(process.env.support.msg)

        const ticketOptions = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('support_button')
                    .setLabel('Create Ticket')
                    .setStyle('SUCCESS')
            )

        await message.edit({ embeds: [embed], components: [ticketOptions] })

    });



    process.client.on('interactionCreate', async interaction => {
        var user = interaction.user
        var guild = interaction.guild

        if (interaction.customId !== 'support_button') return
        if (guild.id !== process.env.guild) return

        function msToMinutesAndSeconds(ms) {
            var minutes = Math.floor(ms / 60000);
            var seconds = ((ms % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        }

        var member = await guild.members.fetch(user.id)

        var allowDate = new Date(parseInt(member.joinedTimestamp))
        allowDate.setMinutes(allowDate.getMinutes() + 20)

        if (allowDate > new Date() && !await member.roles.cache.find(role => role.name === "Member")) return user.send({ embed: { description: `🚫 Hey <@${user.id}>, you need to have been in our discord for at least 20 minutes before you can open a ticket, you currently have ${msToMinutesAndSeconds(allowDate - new Date())} remaining.\n\nIf you want to bypass this timer, you can alternatively login to our website to verify your account at https://www.horizons.gg/login` } })

        if (blocked.includes(user.id)) {
            return interaction.reply({ content: 'You have been blacklisted from the ticket system.', ephemeral: true })
        }


        var tickets = []
        var openTickets = await guild.channels.cache.get(process.env.support.open).children.map(channel => channel)
        var closedTickets = await guild.channels.cache.get(process.env.support.closed).children.map(channel => channel)

        for (ticket of openTickets) {
            tickets.push(ticket)
        }
        for (ticket of closedTickets) {
            tickets.push(ticket)
        }


        var ticketIds = []
        var ticketId = 1

        var data = JSON.parse(fs.readFileSync(ticketData))

        for (ticketChannel of tickets) {
            if (data[ticketChannel.id].owner === user.id) {
                if (openTickets.includes(ticketChannel)) {
                    return interaction.reply({ content: 'You already have an open ticket.', ephemeral: true })
                }
            }
            ticketIds.push(parseInt(ticketChannel.name.split('-')[1]))
        }

        for (id of ticketIds) {
            if (!ticketIds.includes(ticketId)) {
                continue
            } else {
                ticketId += 1
            }
        }


        const zeroPad = (num, places) => String(num).padStart(places, '0')

        guild.channels.create(`ticket-${zeroPad(ticketId, 2)}`, { parent: process.env.support.open, position: ticketId.toString() })
            .then(ticketChannel => {

                data[ticketChannel.id] = data[ticketChannel.id] || {}

                interaction.reply({ content: `**New Ticket opened in <#${ticketChannel.id}>**\n*Make sure to select a support type!*`, ephemeral: true})


                const supportTypes = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('support_type')
                            .setPlaceholder('Please Select a Support Type...')
                            .addOptions([
                                {
                                    label: '🌐 General',
                                    value: 'general',
                                },
                                {
                                    label: '🚀 Space Engineers',
                                    value: 'se',
                                },
                                {
                                    label: '🪖 Squad',
                                    value: 'squad',
                                },
                                {
                                    label: '🌏 Eco',
                                    value: 'eco',
                                },
                                {
                                    label: '🎒 SCUM',
                                    value: 'scum',
                                },
                                {
                                    label: '⛏ Minecraft',
                                    value: 'mc',
                                },
                            ]),
                    )

                const supportCancel = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('support_cancel')
                            .setLabel('Cancel Ticket')
                            .setStyle('DANGER')
                    )

                ticketChannel.send({
                    content: '_ _',
                    components: [supportTypes, supportCancel]
                })
                    .then(msg => {

                        msg.pin()

                        ticketChannel.permissionOverwrites.edit(user, {
                            VIEW_CHANNEL: true,
                            SEND_MESSAGES: false
                        })


                        var nextTime = new Date()
                        nextTime.setMinutes(nextTime.getMinutes() + 5)

                        data[ticketChannel.id] = {
                            "owner": user.id,
                            "controls": msg.id,
                            "designation": 'new',
                            "creation": new Date(),
                            "bell": nextTime,
                            "assigned": []
                        }
                        fs.writeFileSync(ticketData, JSON.stringify(data, null, '\t'))
                    })
            })
    });

}