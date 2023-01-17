//? Dependencies

import Discord from 'discord.js'

import * as _colors from './colors'
const Colors = _colors as any



//? No Reply

export const noReply = (interaction: Discord.Interaction) => {
    if (interaction.isChatInputCommand()) interaction.reply({ content: '_ _', ephemeral: true }).then(() => interaction.deleteReply())
    else if (interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit()) interaction.deferUpdate()
}



//? Responses

export const responseStandard = (message: string, interaction: Discord.CommandInteraction | Discord.ChatInputCommandInteraction | Discord.ButtonInteraction | Discord.ModalSubmitInteraction | Discord.AnySelectMenuInteraction, title?: string, persistent?: boolean) =>
    interaction.reply({
        ephemeral: true,
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle(title || 'Response')
                .setColor(Colors.primary)
                .setDescription(`>>> ${message}`)
        ]
    })
        .then(() => {
            if (!persistent) setTimeout(() => interaction.deleteReply().catch(() => null), 5000)
        })


export const responseError = (message: string, interaction: Discord.CommandInteraction | Discord.ChatInputCommandInteraction | Discord.ButtonInteraction | Discord.ModalSubmitInteraction | Discord.AnySelectMenuInteraction, title?: string) =>
    interaction.reply({
        ephemeral: true,
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle(title || 'Error')
                .setColor(Colors.danger)
                .setDescription(`>>> ${message}`)
        ]
    })



//? Notifications

export const notifyStandard = (message: string, channel: Discord.TextBasedChannel, title?: string, color?: _colors.Color, components?: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[]) =>
    channel.send({
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle(title || 'Response')
                .setColor(Colors[color || 'primary'])
                .setDescription(message)
        ],
        components
    })