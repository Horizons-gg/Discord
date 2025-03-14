import Discord, { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js'

import Ticket from 'module/tickets'


export default {
    name: 'remove',
    description: 'Remove a user to the ticket',
    type: ApplicationCommandOptionType.Subcommand,

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })

        Ticket.removeUser(interaction)
            .then(() => interaction.deleteReply())
            .catch(msg => interaction.editReply({ content: msg }))
    }
} as ChatSubcommand