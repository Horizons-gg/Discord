const User = require('../../../lib/Levels/user').User

module.exports = async interaction => {

    await User.fetch(interaction.user.id).then(user => {
        if (!user) return interaction.reply('You do not have an account!')

        interaction.reply({
            embeds: [{
                title: `${interaction.user.username}'s Account`,
                description: `**Level:** ${user.level}\n**XP:** ${user.xp}/${Math.floor(Math.pow(user.level, 1.1) * 40)}`,
            }]
        })
    })

}