//? Dependencies

import BotManager from '@lib/classes/bot'

import Discord from 'discord.js'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('remove')
    .setDescription('Remove a bot from the network')
    
    .addUserOption(option => option
        .setName('bot')
        .setDescription('Target Bot to be removed')
        .setRequired(true)
    )



//? Response

export const response = (interaction: Discord.ChatInputCommandInteraction) => {

    const Bot = new BotManager((interaction.options.getMember('bot') as Discord.GuildMember).id)

    Bot.delete()
        .then(res => interaction.reply({ content: res, ephemeral: true }))
        .catch(err => interaction.reply({ content: err, ephemeral: true }))

}