const { MessageActionRow, MessageSelectMenu } = require('discord.js')


module.exports = async (interaction, flag) => {

    //? Fetch Ticket
    const Ticket = await process.db.collection('tickets').findOne({ channel: interaction.channel.id })


    //? Prep FAQ
    const FAQ = process.env.ticket.options[Ticket.designation][3]
    if (!FAQ) return


    //? Send FAQ Response
    interaction.reply(FAQ[interaction.values[0]].response)

}