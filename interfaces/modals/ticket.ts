//? Dependencies

import Discord from 'discord.js'

import * as Ticket from '@lib/ticket'

import { User } from '@lib/discord'



//? Handle

export default async function (interaction: Discord.ModalSubmitInteraction) {

    Ticket.create(interaction.user.id, {
        title: interaction.fields.getTextInputValue('title'),
        service: interaction.fields.getTextInputValue('service'),
        description: interaction.fields.getTextInputValue('description')
    })
        .then(channel => {
            interaction.reply({ content: `Ticket has been opened in: ${channel}`, ephemeral: true })
        })
        .catch(err => {
            interaction.reply({ content: `Error: \`${err}\``, ephemeral: true })
        })

}