//? Dependencies

import Discord from 'discord.js'

import { Messages } from '@lib/discord'

import * as Ticket from '@lib/ticket'



//? Handle

export default async function (interaction: Discord.ButtonInteraction) {

    if (interaction.channel) Ticket.delete(interaction.channel.id, interaction.user.id)
        .then(res => Messages.responseStandard(res, interaction, 'Ticket Deleted'))
        .catch(err => Messages.responseError(err, interaction, 'Failed to Delete Ticket'))

}