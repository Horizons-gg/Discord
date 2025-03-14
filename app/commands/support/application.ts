import Discord, { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js'

import Modal from 'modals/application.ts'


export default {
    name: 'application',
    description: 'Submit an Application',
    type: ApplicationCommandOptionType.Subcommand,

    execute(interaction) {
        interaction.showModal(Modal)
    }
} as ChatSubcommand