const Raw = process.env.ticket.options
const { MessageActionRow, MessageButton } = require('discord.js')



const Options = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('ticket-open')
            .setLabel('🔓 Open Ticket')
            .setStyle('SUCCESS'),

        new MessageButton()
            .setCustomId('ticket-archive')
            .setLabel('📂 Archive Ticket')
            .setStyle('PRIMARY'),

        new MessageButton()
            .setCustomId('ticket-delete')
            .setLabel('🛡️ Delete Ticket')
            .setStyle('DANGER')
            .setDisabled(false)
    )



module.exports = async (interaction) => {

    //? Prerequisites
    var Tickets = await process.db.collection('tickets')
    var Ticket = await Tickets.findOne({ channel: interaction.channel.id })
    var Client = process.client
    var Guild = Client.guilds.cache.get(process.env.discord.guild)

    if (!Ticket.owner) return require('./cancel')(interaction)
    var User = await Guild.members.fetch(Ticket.owner).catch(() => console.log('Failed to fetch user'))
    if (!User) return require('./cancel')(interaction)


    //? Update Access
    Guild.roles.cache.find(role => {
        if (role.name !== "Receiving Support") return
        User.roles.remove(role)
    })


    //? Update Channel
    interaction.channel.edit({ parent: process.env.ticket.closed, lockPermissions: false })


    //? Update Controls
    interaction.update({
        embeds: [{
            title: "🔒 Ticket Closed",
            color: '#f35252',
            author: {
                name: `${Raw[Ticket.designation][0]} - Support`
            },
            fields: [
                { name: 'Ticker Owner', value: `<@${User.id}>`, inline: true },
                { name: 'Designation', value: `\`${Raw[Ticket.designation][0]}\``, inline: true },
                { name: 'Region', value: `\`${Ticket.region}\``, inline: true },
                { name: 'Created', value: `<t:${Math.floor(new Date(Ticket.created).getTime() / 1000)}:F>`, inline: true },
                { name: 'Closed', value: `<t:${Math.floor(new Date().getTime() / 1000)}:R>`, inline: true }
            ],
            thumbnail: {
                url: User.user.avatarURL()
            }
        }],
        components: [Options]
    })


    //? Update Ticket
    await Tickets.updateOne({ channel: interaction.channel.id }, { $set: { status: 'closed', closed: new Date() } })


    //? Send Notification
    interaction.channel.send({ embeds: [{ description: `🔒 Ticket has been closed by <@${interaction.user.id}>` }] })

}