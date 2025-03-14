import Discord, { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js'

import Ticket from 'module/tickets'


export default {
    name: 'open',
    description: 'Open the ticket in the current channel',
    type: ApplicationCommandOptionType.Subcommand,

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })

        Ticket.open(interaction)
            .then(() => interaction.deleteReply())
            .catch(msg => interaction.editReply({ content: msg }))
    }
} as ChatSubcommand