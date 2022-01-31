const Raw = process.env.ticket.options
const { MessageActionRow, MessageButton } = require('discord.js')



const Close = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('ticket-cancel')
            .setLabel('Cancel Ticket')
            .setStyle('DANGER')
    )



module.exports = async (interaction, fresh) => {

    //? Prerequisites
    var Tickets = await process.db.collection('tickets')
    var Client = process.client
    var Guild = Client.guilds.cache.get(process.env.discord.guild)
    var User = await Guild.members.fetch(interaction.user.id)


    

}