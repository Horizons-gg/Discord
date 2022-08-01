import Config from '@lib/config'
import { Client, DisableBot } from '@app/discord'
import { Collections } from '@app/mongo'
import * as Discord from 'discord.js'


export async function main(interaction) {

    const User: Discord.User = interaction.options._hoistedOptions[0].user
    if (!User.bot) interaction.reply({ content: `<@${User.id}> is not a bot!`, ephemeral: true })

    
    const Guild = Client.guilds.cache.get(Config.discord.guild)
    const Bot = Guild.members.cache.get(User.id) || await Guild.members.fetch(User.id)

    DisableBot(User.id).catch(error => console.log(`Network Bot: ${error}`))

    Bot.roles.remove(Guild.roles.cache.filter(role => ['Bots', 'Game Servers', 'Dedicated Servers'].includes(role.name)))
    Collections.Bots.deleteOne({ id: User.id })

    interaction.reply({ content: `<@${User.id}> was successfully removed from the servers bots!`, ephemeral: true })
}