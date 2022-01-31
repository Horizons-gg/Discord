const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')

const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('ticket-create')
            .setLabel('Create Ticket')
            .setStyle('SUCCESS'),
    )



module.exports = async (interaction, flag) => {

    //? Prerequisites
    var Tickets = await process.db.collection('tickets')
    var Client = process.client
    var Guild = Client.guilds.cache.get(process.env.discord.guild)
    var User = await Guild.members.fetch(interaction.user.id)


    //? Validate users age in guild
    console.log(parseInt(User.joinedTimestamp))
    if (parseInt(User.joinedTimestamp) + 1200000 > new Date().getMilliseconds() && !await User.roles.cache.find(role => role.name === "Member")) return interaction.reply({ content: `You need to be in this discord for at least 20 minutes before you can open tickets, you can open tickets at <t:${Math.floor(parseInt(User.joinedTimestamp) / 1000 + 1200)}:t>`, ephemeral: true })


    //? Check for already open tickets
    if (await Tickets.findOne({ owner: interaction.user.id, status: 'open' })) return interaction.reply({ content: 'You already have an open ticket!', ephemeral: true })


    //? Prepare Ticket
    var Order = await Tickets.find().sort({ _id: -1 }).toArray()
    console.log(Order)


}