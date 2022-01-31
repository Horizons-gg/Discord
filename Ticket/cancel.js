module.exports = async (interaction) => {

    //? Delete Ticket
    await process.db.collection('tickets').deleteOne({ channel: interaction.channel.id })
    await interaction.channel.delete()

}