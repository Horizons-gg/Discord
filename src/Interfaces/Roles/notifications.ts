import Config from "@lib/config"
import { Client } from "@app/discord"



export async function main(interaction) {

    //? Prerequisites
    const Guild = Client.guilds.cache.get(Config.discord.guild)
    const User = await Guild.members.fetch(interaction.user.id)


    //? Remove Roles
    if (!interaction.values.includes('major')) User.roles.remove(Guild.roles.cache.find(role => role.name === '🔔Major'))
    if (!interaction.values.includes('minor')) User.roles.remove(Guild.roles.cache.find(role => role.name === '🔔Minor'))
    if (!interaction.values.includes('stream')) User.roles.remove(Guild.roles.cache.find(role => role.name === '🎬Stream Notifications'))


    //? Add Roles
    if (interaction.values.includes('major')) User.roles.add(Guild.roles.cache.find(role => role.name === '🔔Major'))
    if (interaction.values.includes('minor')) User.roles.add(Guild.roles.cache.find(role => role.name === '🔔Minor'))
    if (interaction.values.includes('stream')) User.roles.add(Guild.roles.cache.find(role => role.name === '🎬Stream Notifications'))

    interaction.reply({ content: 'Your Notifications have been updated!', ephemeral: true })

}