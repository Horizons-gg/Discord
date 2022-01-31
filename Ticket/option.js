const Raw = process.env.ticket.options
const { MessageActionRow, MessageButton } = require('discord.js')



const Cancel = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('ticket-cancel')
            .setLabel('Cancel Ticket')
            .setStyle('DANGER')
    )



module.exports = async (interaction) => {

    //? Prerequisites
    var Tickets = await process.db.collection('tickets')
    var Client = process.client
    var Guild = Client.guilds.cache.get(process.env.discord.guild)
    var User = await Guild.members.fetch(interaction.user.id)


    //? Validate Selection
    var Designation = interaction.values[0]
    if (!Raw[Designation][1]) return interaction.reply({ content: 'All Regions', ephemeral: true })
    if (!Raw[Designation][1].includes(',')) var Regions = [Raw[Designation][1]]
    else var Regions = Raw[Designation][1].split(',')


    //? Create Controls
    var Options = new MessageActionRow()
    Regions.forEach(region => {
        Options.addComponents(
            new MessageButton()
                .setCustomId(`ticket-region-${region}`)
                .setLabel(region)
                .setStyle('PRIMARY')
        )
    })


    //? Update Controls
    interaction.update({
        embeds: [{
            title: 'Select an Available Region',
            color: "#3098d9",
            author: {
                name: `${Raw[Designation][0]} - Support`
            }
        }], components: [Options, Cancel]
    })


    //? Update Ticket
    await Tickets.updateOne({ channel: interaction.channel.id }, { $set: { designation: Designation } })

}