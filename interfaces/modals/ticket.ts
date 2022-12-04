//? Dependencies

import Discord from 'discord.js'

import TicketManager from '@lib/ticket'

import { User } from '@lib/discord'



//? Handle

export default async function (interaction: Discord.ModalSubmitInteraction) {

    const Ticket = new TicketManager()

    Ticket.owner = await User(interaction.user.id)

    Ticket.details = {
        title: interaction.fields.getTextInputValue('title'),
        service: interaction.fields.getTextInputValue('service'),
        description: interaction.fields.getTextInputValue('description')
    }


    Ticket.initialize()
        .then(() => interaction.reply({ content: `Ticket Created in ${Ticket.channel}`, ephemeral: true }))
        .catch(error => interaction.reply({ content: `Error: ${error}`, ephemeral: true }))

}