//? Dependencies

import Discord from 'discord.js'

import Modal from '@lib/templates/modals/report'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('report')
    .setDescription('Report a Member of the Community to the Staff Team')



//? Response

export const response = (interaction: Discord.ChatInputCommandInteraction) => {
    
    interaction.showModal(Modal)

}