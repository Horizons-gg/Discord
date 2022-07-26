
module.exports = async (interaction, flag) => {

    //? Update Ticket
    await process.db.collection('tickets').updateOne({ channel: interaction.channel.id }, { $set: { region: flag[2] } })


    //? Finalize Ticket
    require('./open.js')(interaction, flag, true)

}