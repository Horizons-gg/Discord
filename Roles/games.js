
module.exports = async (interaction) => {

    //? Prerequisites
    var Client = process.client
    var Guild = Client.guilds.cache.get(process.env.discord.guild)
    var User = await Guild.members.fetch(interaction.user.id)


    //? Remove Roles
    for (opt in process.env.roles.options) {
        Guild.roles.cache.find(role => {
            if (role.name === process.env.roles.options[opt][2] && !interaction.values.includes(opt)) User.roles.remove(role)
        })
    }


    //? Add Roles
    for (opt in process.env.roles.options) {
        Guild.roles.cache.find(role => {
            if (role.name === process.env.roles.options[opt][2] && interaction.values.includes(opt)) User.roles.add(role)
        })
    }

    interaction.reply({ content: 'Your Notifications have been updated!', ephemeral: true })

}