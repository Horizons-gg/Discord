import Discord, { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js'

import Modal from 'modals/report.ts'


export default {
    name: 'report',
    description: 'Report a Member to our Staff',
    type: ApplicationCommandOptionType.Subcommand,

    execute(interaction) {
        interaction.showModal(Modal)
    }
} as ChatSubcommand