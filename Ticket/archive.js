
module.exports = async (interaction) => {

    await process.db.collection('tickets').updateOne({ channel: interaction.channel.id }, { $set: { status: 'archived' } })
    interaction.channel.delete()

}