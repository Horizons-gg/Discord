const { MessageActionRow, MessageButton } = require('discord.js')

const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('ticket-create')
            .setLabel('Create Ticket')
            .setStyle('SUCCESS'),
    )



module.exports = async (interaction) => {

    if (interaction.options._subcommand === 'assist') {
        interaction.reply({
            embeds: [{
                title: "<:support:845624848466182164> **Horizons Community Support**",
                description: ">>> The Horizons Staff Team will help you with any issues you may be having.\nMake sure to explain your issue to us and if you want, you can even add other members to the ticket!",
                color: "#3ba55d",
                thumbnail: {
                    url: 'https://i.imgur.com/MVGVVBr.png',
                }
            }],
            components: [row]
        })
    }

    if (interaction.options._subcommand === 'create') {
        require(`../Ticket/create.js`)(interaction)
    }




    if (interaction.options._subcommand === 'add') {

        //? Check if User was Mentioned
        if (!interaction.options._hoistedOptions[0]) return interaction.reply({content: 'Please specify a user to add to the ticket.', ephemeral: true})


        //? Prerequisites
        var Tickets = await process.db.collection('tickets')
        var Ticket = await Tickets.findOne({ channel: interaction.channel.id })
        var User = interaction.options._hoistedOptions[0].member

        if (Ticket.owner === User.id) return interaction.reply('You cannot add the ticket owner to the ticket.')

        interaction.channel.permissionOverwrites.edit(User, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true
        })

        interaction.reply({ embeds: [{ "description": `✅ <@${User.id}> has been granted access to this Ticket!` }] })
        User.send({ embeds: [{ "description": `📩 <@${interaction.user.id}> has granted you access to Ticket <#${interaction.channel.id}>` }] }).catch(() => console.log('Failed to send direct message'))
    }

    if (interaction.options._subcommand === 'remove') {

        //? Check if User was Mentioned
        if (!interaction.options._hoistedOptions[0]) return interaction.reply({content: 'Please specify a user to add to the ticket.', ephemeral: true})

        //? Prerequisites
        var Tickets = await process.db.collection('tickets')
        var Ticket = await Tickets.findOne({ channel: interaction.channel.id })
        var User = interaction.options._hoistedOptions[0].member

        if (Ticket.owner === User.id) return interaction.reply('You cannot remove the ticket owner from the ticket.')

        if (interaction.channel.permissionOverwrites.cache.get(User.id)) interaction.channel.permissionOverwrites.cache.get(User.id).delete()
        else return interaction.reply({content: 'User does not exist in this ticket.', ephemeral: true})

        interaction.reply({ embeds: [{ "description": `❌ <@${User.id}>'s access to this Ticket has been revoked!` }] })
        User.send({ embeds: [{ "description": `⛔ <@${interaction.user.id}> has revoked your access to Ticket <#${interaction.channel.id}>` }] }).catch(() => console.log('Failed to send direct message'))
    }

}