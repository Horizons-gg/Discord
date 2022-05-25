const Permission = require('../../lib/permission')


module.exports = async (interaction) => {

    //? Check Permissions
    if (!await Permission.Check(interaction.user, process.env.ticket.permissions.archive)) return interaction.reply({ content: 'You do not have permission to archive tickets.', ephemeral: true })


    //? Archive Ticket
    await process.db.collection('tickets').updateOne({ channel: interaction.channel.id }, { $set: { status: 'archived' } })
    interaction.channel.delete()

}