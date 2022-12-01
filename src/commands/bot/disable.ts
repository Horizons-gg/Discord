//? Dependencies

import BotManager from '@lib/classes/bot'

import Discord from 'discord.js'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('disable')
    .setDescription('Disable a Bot on the Network')

    .addUserOption(option => option
        .setName('bot')
        .setDescription('Target Bot to be disabled')
        .setRequired(true)
    )



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const Bot = new BotManager((interaction.options.getMember('bot') as Discord.GuildMember).id)
    await Bot.fetch().catch(err => interaction.reply({ content: err, ephemeral: true }))
    if (!Bot) return

    Bot.disable()
        .then(res => interaction.reply({ content: res, ephemeral: true }))
        .catch(err => interaction.reply({ content: err, ephemeral: true }))

}