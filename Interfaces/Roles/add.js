
module.exports = async (interaction, flag) => {

    //? Prerequisites
    var Client = process.client
    var Guild = Client.guilds.cache.get(process.env.discord.guild)
    var User = await Guild.members.fetch(interaction.user.id)


    //? Add Roles
    for (opt in process.env.roles.options) {
        Guild.roles.cache.find(role => {
            if (role.name === process.env.roles.options[opt][2] && opt === flag[2]) User.roles.add(role).catch(() => 'Failed to update user roles.'), interaction.reply({ content: `You have been added to the \`${process.env.roles.options[opt][0]}\` role and will now receive notifications!`, ephemeral: true })
        })
    }

}