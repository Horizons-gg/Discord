const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')

const ticketData = './cache/tickets.json'

const fs = require('fs')

const prefix = process.env.prefix
const commands = `**User Allowed**\n\`${prefix}add <Member ID>\` - Add more users to Ticket\n\`${prefix}remove <Member ID>\` - Remove users from Ticket\n\`${prefix}update <general, se, squad, eco, scum, mc>\` - Designation\n\n**Admin Only**\n\`${prefix}assign @User\` - Assign a Staff Member to the Ticket\n\`${prefix}withdraw @User\` - Withdraw a Staff Member from this Ticket`

async function bulkMessage(ticketOwner, roles, type, interaction, data, dataRAW, guild) {
    var members = []
    var channelPing = `<@&685774855903248394> `

    data.designation = type

    for (role of roles) {
        var thisRole = undefined
        await guild.roles.cache.map(inRole => {
            if (inRole.name === role) { thisRole = inRole }
        })

        var theseMembers = await thisRole.members.map(member => member)
        for (member of theseMembers) {
            if (!members.includes(member)) {
                members.push(member)
            }
        }

        channelPing += `<@&${thisRole.id}> `
    }

    for (member of members) {
        if (member.user.bot) continue
        member.user.send({
            embeds: [{
                "author": {
                    "name": `${ticketOwner.user.username} #${ticketOwner.user.discriminator}`
                },
                "thumbnail": {
                    "url": ticketOwner.user.avatarURL()
                },
                "title": "Support Required!",
                "color": "#e87431",
                "description": `>>> Client: <@${ticketOwner.id}>\nTicket: <#${interaction.message.channel.id}>\nDesignation: \`${type}\``,
                "timestamp": Date.parse(data.creation)
            }]
        })
    }

    interaction.message.channel.send(channelPing)

    dataRAW[interaction.message.channel.id] = data
    fs.writeFileSync(ticketData, JSON.stringify(dataRAW, null, '\t'))
}



async function openTicket(ticketOwner, interaction, data, dataRAW, guild, stage) {

    var assigned = ''
    for (assistant of data.assigned) {
        assigned += `<@${assistant}>\n`
    }

    var ticketOptions = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('ticket_close')
                .setLabel('Close Ticket')
                .setStyle('DANGER')
                .setEmoji('🔒'),

            new MessageButton()
                .setCustomId('ticket_alert')
                .setLabel('Alert Staff')
                .setStyle('SECONDARY')
                .setEmoji('🛎️'),

            new MessageButton()
                .setCustomId('ticket_join')
                .setLabel('Join/Leave Ticket')
                .setStyle('SUCCESS')
        )

    interaction.message.edit({
        embeds: [{
            "title": "🔓 Ticket Open",
            "color": '#54db68',
            "fields": [
                { 'name': 'Commands', 'value': `>>> ${commands}` },
                { 'name': 'Information', 'value': `>>> Designation | \`${data.designation}\`\nTicket Owner | <@${ticketOwner.id}>`, inline: true },
                { 'name': 'Assigned', 'value': `>>> ${assigned || 'Nobody'}`, inline: true }
            ],
            "thumbnail": {
                "url": ticketOwner.user.avatarURL()
            },
            "timestamp": Date.parse(data.creation)
        }],
        components: [ticketOptions]
    })

    ticketOwner.roles.add(guild.roles.cache.find(role => role.name === "Receiving Support"))
}



async function closeTicket(ticketOwner, interaction, data, dataRAW, guild, emojis) {
    var assigned = ''
    for (assistant of data.assigned) {
        assigned += `<@${assistant}>\n`
    }

    ticketOptions = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('ticket_open')
                .setLabel('Open Ticket')
                .setStyle('SUCCESS')
                .setEmoji('🔓'),

            new MessageButton()
                .setCustomId('ticket_delete')
                .setLabel('Delete Ticket')
                .setStyle('DANGER')
        )

    interaction.message.edit({
        embeds: [{
            "title": "🔒 Ticket Closed",
            "color": '#f35252',
            "fields": [
                { 'name': 'Options', 'value': '>>> 🔓 | Open Ticket\n❌ | Permanently Remove Ticket (Managers+ Only)' },
                { 'name': 'Commands', 'value': `>>> ${commands}` },
                { 'name': 'Information', 'value': `>>> Designation | \`${data.designation}\`\nTicket Owner | <@${ticketOwner.id}>`, inline: true },
                { 'name': 'Assigned', 'value': `>>> ${assigned || 'Nobody'}`, inline: true }
            ],
            "thumbnail": {
                "url": ticketOwner.user.avatarURL()
            },
            "timestamp": Date.parse(data.creation)
        }],
        components: [ticketOptions]
    })

    ticketOwner.roles.remove(guild.roles.cache.find(role => role.name === "Receiving Support"))
}



module.exports = {
    bulkMessage: bulkMessage,
    openTicket: openTicket,
    closeTicket: closeTicket
}