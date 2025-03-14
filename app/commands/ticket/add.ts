import Discord, { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js'

import Ticket from 'module/tickets'


export default {
    name: 'add',
    description: 'Add a user to the ticket',
    type: ApplicationCommandOptionType.Subcommand,

    options: [
        {
            name: 'user',
            description: 'User to add to the ticket',
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })

        Ticket.addUser(interaction)
            .then(() => interaction.deleteReply())
            .catch(msg => interaction.editReply({ content: msg }))
    }
} as ChatSubcommand