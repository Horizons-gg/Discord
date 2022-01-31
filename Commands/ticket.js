const { MessageActionRow, MessageButton } = require('discord.js')

const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('ticket-create')
            .setLabel('Create Ticket')
            .setStyle('SUCCESS'),
    )



module.exports = (interaction) => {

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