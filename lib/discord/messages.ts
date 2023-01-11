//? Dependencies

import Discord from 'discord.js'

import * as Colors from './colors'



//? Methods

export const responseStandard = (message: string, interaction: Discord.CommandInteraction | Discord.ChatInputCommandInteraction | Discord.ButtonInteraction | Discord.ModalSubmitInteraction, title?: string) =>
    interaction.reply({
        ephemeral: true,
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle(title || 'Response')
                .setColor(Colors.primary)
                .setDescription(`>>> ${message}`)
        ]
    })


export const responseError = (message: string, interaction: Discord.CommandInteraction | Discord.ChatInputCommandInteraction | Discord.ButtonInteraction | Discord.ModalSubmitInteraction, title?: string) =>
    interaction.reply({
        ephemeral: true,
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle(title || 'Error')
                .setColor(Colors.danger)
                .setDescription(`>>> ${message}`)
        ]
    })