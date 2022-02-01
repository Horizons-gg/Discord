const { MessageActionRow, MessageButton } = require('discord.js')



module.exports = (panel) => {


    if (panel === 'pronouns') {
        const Row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('roles-pronouns-he')
                    .setLabel('✨ He/Him')
                    .setStyle('SECONDARY'),

                new MessageButton()
                    .setCustomId('roles-pronouns-she')
                    .setLabel('💞 She/Her')
                    .setStyle('SECONDARY'),

                new MessageButton()
                    .setCustomId('roles-pronouns-they')
                    .setLabel('💖 They/Them')
                    .setStyle('SECONDARY')
            )

        return {
            embeds: [{
                title: 'Pronouns'
            }],
            components: [Row]
        }
    }


}