const Permission = require('../lib/permission')


module.exports = async (interaction) => {

    //? Check Permissions
    if (!await Permission.Check(interaction.user, process.env.ticket.permissions.delete)) return interaction.reply({ content: 'You do not have permission to delete tickets.', ephemeral: true })


    //? Delete Ticket
    await process.db.collection('tickets').deleteOne({ channel: interaction.channel.id })
    await interaction.channel.delete()

}