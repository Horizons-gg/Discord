const Raw = process.env.ticket.options
const { MessageActionRow, MessageButton } = require('discord.js')



const Options = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('ticket-close')
            .setLabel('🔒 Close Ticket')
            .setStyle('DANGER'),

        new MessageButton()
            .setCustomId('ticket-alert')
            .setLabel('🛎️ Alert Staff')
            .setStyle('SECONDARY')
            .setDisabled(true)
    )



module.exports = async (interaction, flag, fresh) => {

    //? Prerequisites
    var Tickets = await process.db.collection('tickets')
    var Ticket = await Tickets.findOne({ channel: interaction.channel.id })
    var Client = process.client
    var Guild = Client.guilds.cache.get(process.env.discord.guild)

    if (!Ticket.owner) return require('./cancel')(interaction)
    var User = await Guild.members.fetch(Ticket.owner).catch(() => console.log('Failed to fetch user'))
    if (!User) return require('./cancel')(interaction)


    //? Update Access
    interaction.channel.permissionOverwrites.edit(User, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true
    })

    Guild.roles.cache.find(role => {
        if (role.name !== "Receiving Support") return
        User.roles.add(role)
    })


    //? Update Channel
    interaction.channel.edit({ parent: process.env.ticket.open, lockPermissions: false })


    //? Update Controls
    interaction.update({
        embeds: [{
            title: "🔓 Ticket Open",
            color: '#54db68',
            author: {
                name: `${Raw[Ticket.designation][0]} - Support`
            },
            fields: [
                { name: 'Ticker Owner', value: `<@${User.id}>`, inline: true },
                { name: 'Designation', value: `\`${Raw[Ticket.designation][0]}\``, inline: true },
                { name: 'Region', value: `\`${Ticket.region}\``, inline: true },
                { name: 'Created', value: `<t:${Math.floor(new Date(Ticket.created).getTime() / 1000)}:F>`, inline: true }
            ],
            thumbnail: {
                url: User.user.avatarURL()
            }
        }],
        components: [Options]
    })


    //? Update Ticket
    await Tickets.updateOne({ channel: interaction.channel.id }, { $set: { status: 'open' } })


    //? Notify Staff
    if (!fresh) return interaction.channel.send({ embeds: [{ description: `🔓 Ticket has been opened by <@${interaction.user.id}>` }] })
    var Ping = []
    Raw[Ticket.designation][2].split(',').forEach(role => {
        Guild.roles.cache.some(r => {
            if (r.name === role) {
                Ping.push(`<@&${r.id}>`)
            }
        })
    })
    interaction.channel.send(Ping.join(' '))

}