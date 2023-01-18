//? Dependencies

import Discord from 'discord.js'

import Modal from '@lib/templates/modals/application'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('application')
    .setDescription('Submit a Staff Application to Management')



//? Response

export const response = (interaction: Discord.ChatInputCommandInteraction) => {
    
    interaction.showModal(Modal)

}