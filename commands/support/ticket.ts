//? Dependencies

import Discord from 'discord.js'

import Modal from '@lib/templates/modals/ticket'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('ticket')
    .setDescription('Open a New Support Ticket')



//? Response

export const response = (interaction: Discord.ChatInputCommandInteraction) => {
    
    interaction.showModal(Modal)

}