//? Dependencies

import Discord from 'discord.js'

import { Messages } from '@lib/discord'

import * as Ticket from '@lib/ticket'



//? Handle

export default async function (interaction: Discord.ModalSubmitInteraction) {

    Ticket.create(interaction.user.id, {
        title: interaction.fields.getTextInputValue('title'),
        service: interaction.fields.getTextInputValue('service'),
        region: interaction.fields.getTextInputValue('region') || 'N/A',
        description: interaction.fields.getTextInputValue('description')
    })
        .then(channel => {
            Messages.responseStandard(`Ticket has been opened in: ${channel}`, interaction, 'New Ticket Created')
        })
        .catch(err => {
            Messages.responseError(err, interaction, 'Failed to Create Ticket')
        })

}