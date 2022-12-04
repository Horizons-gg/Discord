//? Dependencies

import BotManager from '@lib/bot'

import Discord from 'discord.js'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('add')
    .setDescription('Add a new bot to the network')

    .addStringOption(option => option
        .setName('type')
        .setDescription('Type of bot')
        .setRequired(true)
        .addChoices(
            { name: 'Game Bot', value: 'game' },
            { name: 'Dedicated Server Bot', value: 'server' }
        )
    )

    .addUserOption(option => option
        .setName('bot')
        .setDescription('Target Bot to be added')
        .setRequired(true)
    )

    .addStringOption(option => option
        .setName('token')
        .setDescription('The Token for the Bot')
        .setRequired(true)
    )

    .addStringOption(option => option
        .setName('tag')
        .setDescription('Add a tag to this bot to help keep track of it (Must be unique and have no spaces)')
        .setRequired(true)
    )



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const Bot = new BotManager((interaction.options.getMember('bot') as Discord.GuildMember).id)

    Bot.token = interaction.options.getString('token')
    Bot.type = interaction.options.getString('type') as Bot['type']
    Bot.tag = interaction.options.getString('tag')

    Bot.create()
        .then(res => interaction.reply({ content: res, ephemeral: true }))
        .catch(err => interaction.reply({ content: err, ephemeral: true }))

}