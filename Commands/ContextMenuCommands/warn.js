const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')


module.exports = interaction => {

    console.log(interaction)

    interaction.reply({
        embeds: [{
            "title": "Test",
            "description": `Test`
        }],
        ephemeral: true
    })

}



// const ActionBar = new MessageActionRow()
//     .addComponents(
//         new MessageSelectMenu()
//             .setCustomId('warn-add')
//             .setPlaceholder("Select a Violation...")
//             .addOptions()
//     )