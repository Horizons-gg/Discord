//? Dependencies

import Discord from 'discord.js'

import { Messages } from '@lib/discord'

import * as Ticket from '@lib/ticket'



//? Handle

export default async function (interaction: Discord.ButtonInteraction) {

    if (interaction.channel) Ticket.open(interaction.channel.id, interaction.user.id)
        .then(() => Messages.noReply(interaction))
        .catch(err => Messages.responseError(err, interaction, 'Failed to Open Ticket'))

}