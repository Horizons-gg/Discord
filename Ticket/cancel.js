module.exports = async (interaction) => {

    //? Prerequisites
    var Tickets = await process.db.collection('tickets')
    var Client = process.client
    var Guild = Client.guilds.cache.get(process.env.discord.guild)
    var Channel = await Guild.channels.fetch(interaction.channel.id)


    //? Delete Ticket
    await Tickets.deleteOne({ channel: interaction.channel.id })
    await Channel.delete()

}