
module.exports = async (interaction, flag) => {

    //? Prerequisites
    var Tickets = await process.db.collection('tickets')
    var Client = process.client
    var Guild = Client.guilds.cache.get(process.env.discord.guild)
    var User = await Guild.members.fetch(interaction.user.id)


    //? Update Ticket
    await Tickets.updateOne({ channel: interaction.channel.id }, { $set: { region: flag[2] } })


    //? Finalize Ticket
    require('./open.js')(interaction, true)

}