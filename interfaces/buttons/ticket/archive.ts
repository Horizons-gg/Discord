//? Dependencies

import Discord from 'discord.js'

import { Messages } from '@lib/discord'

import * as Ticket from '@lib/ticket'



//? Handle

export default async function (interaction: Discord.ButtonInteraction) {

    if (interaction.channel && interaction.user) Ticket.archive(interaction.channel.id, interaction.user.id)
        .catch(err => Messages.responseError(err, interaction, 'Failed to Archive Ticket'))

}