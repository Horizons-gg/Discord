//? Dependencies

import BotManager from '@lib/classes/bot'

import Discord from 'discord.js'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('edit')
    .setDescription('Edit a bot in the network')

    .addUserOption(option => option
        .setName('bot')
        .setDescription('Target Bot to be edited')
        .setRequired(true)
    )

    .addStringOption(option => option
        .setName('token')
        .setDescription('The Token for the Bot')
        .setRequired(false)
    )

    .addStringOption(option => option
        .setName('tag')
        .setDescription('The tag for this bot that helps keep track of it (Must be unique and have no spaces)')
        .setRequired(false)
    )

    .addStringOption(option => option
        .setName('host')
        .setDescription('The server address and port of the server (Game: 0.0.0.0:1234 | Server: 0.0.0.0/domain.com)')
        .setRequired(false)
    )

    .addStringOption(option => option
        .setName('method')
        .setDescription('The Method the Bot Uses to Query Data (Only for Game Servers)')
        .setRequired(false)
        .addChoices(
            { name: 'Valve Standard', value: 'valve' },
            { name: 'Arma 3', value: 'arma3' },
            { name: 'Eco', value: 'eco' },
            { name: 'Minecraft', value: 'minecraft' },
            { name: 'Squad', value: 'squad' }
        )
    )



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const Bot = new BotManager((interaction.options.getMember('bot') as Discord.GuildMember).id)
    await Bot.fetch().catch(err => interaction.reply({ content: err, ephemeral: true }))
    if (!Bot) return


    const token = interaction.options.getString('token')
    const tag = interaction.options.getString('tag')
    const host = interaction.options.getString('host')
    const method = interaction.options.getString('method') as Bot['method']

    if (token) Bot.setToken(token)
    if (tag) Bot.setTag(tag)
    if (host) Bot.setHost(host)
    if (method) Bot.setMethod(method)

    interaction.reply({ content: `<@${Bot.id}> Bot Updated`, ephemeral: true })

}