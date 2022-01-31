const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')



const Options = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
            .setCustomId('ticket-option')
            .setPlaceholder('Please Select a Support Option...')
            .addOptions(process.env.ticket.raw)
    )

const Cancel = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('ticket-cancel')
            .setLabel('Cancel Ticket')
            .setStyle('DANGER')
    )



module.exports = async (interaction, flag) => {

    //? Prerequisites
    var Tickets = await process.db.collection('tickets')
    var Client = process.client
    var Guild = Client.guilds.cache.get(process.env.discord.guild)
    var User = await Guild.members.fetch(interaction.user.id)


    //? Validate users age in guild
    if (parseInt(User.joinedTimestamp) + 1200000 > new Date().getMilliseconds() && !await User.roles.cache.find(role => role.name === "Member")) return interaction.reply({ content: `You need to be in this discord for at least 20 minutes before you can open tickets, you can open tickets at <t:${Math.floor(parseInt(User.joinedTimestamp) / 1000 + 1200)}:t>`, ephemeral: true })


    //? Check for already open tickets
    if (await Tickets.findOne({ owner: interaction.user.id, status: 'open' })) return interaction.reply({ content: 'You already have an open ticket!', ephemeral: true })


    //? Prepare Ticket
    var Order = await Tickets.find().sort({ _id: 1 }).toArray()
    if (Order.length > 0) var TicketNumber = Order[Order.length - 1]._id + 1
    else var TicketNumber = 1


    //? Create Channel
    var Channel = await Guild.channels.create(`ticket-${zeroPad(TicketNumber, 3)}`, { parent: process.env.ticket.open, position: TicketNumber.toString() })
        .then(channel => {
            channel.permissionOverwrites.edit(User, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: false
            })
            return channel
        })


    //? Send Control Panel
    var Controls = await Channel.send({content: "_ _", components: [Options, Cancel] }).then(message => message.pin())


    //? Create Ticket
    await Tickets.insertOne({
        _id: TicketNumber,
        owner: User.id,
        status: 'open',
        channel: Channel.id,
        controls: Controls.id,
        designation: null,
        region: null
    })


    //? Notify User
    await interaction.reply({ content: `Your ticket has been opened in <#${Channel.id}>, please select an option from the menu to continue.`, ephemeral: true })

}



const zeroPad = (num, places) => String(num).padStart(places, '0')