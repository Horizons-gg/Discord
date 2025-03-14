import Discord, { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js'

import Ticket from 'module/tickets'


export default {
    name: 'ticket',
    description: 'Open a New Support Ticket',
    type: ApplicationCommandOptionType.Subcommand,

    execute(interaction) {
        Ticket.create(interaction.user.id)
            .then(res => {
                if (typeof res === 'string') return interaction.reply(res)

                interaction.reply(`Your Ticket has been Created in ${res}`)
            })
    }
} as ChatSubcommand