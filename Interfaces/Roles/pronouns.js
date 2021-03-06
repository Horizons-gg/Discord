
module.exports = async (interaction) => {

    //? Prerequisites
    var Client = process.client
    var Guild = Client.guilds.cache.get(process.env.discord.guild)
    var User = await Guild.members.fetch(interaction.user.id)


    //? Remove Roles
    if (!interaction.values.includes('he')) User.roles.remove(Guild.roles.cache.find(role => role.name === 'He/Him'))
    if (!interaction.values.includes('she')) User.roles.remove(Guild.roles.cache.find(role => role.name === 'She/Her'))
    if (!interaction.values.includes('they')) User.roles.remove(Guild.roles.cache.find(role => role.name === 'They/Them'))


    //? Add Roles
    if (interaction.values.includes('he')) User.roles.add(Guild.roles.cache.find(role => role.name === 'He/Him'))
    if (interaction.values.includes('she')) User.roles.add(Guild.roles.cache.find(role => role.name === 'She/Her'))
    if (interaction.values.includes('they')) User.roles.add(Guild.roles.cache.find(role => role.name === 'They/Them'))

    interaction.reply({ content: 'Your Pronouns have been updated!', ephemeral: true })

}