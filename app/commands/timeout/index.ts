import { ApplicationCommandType } from 'discord.js'
import panther from './panther.ts'

export default {
    name: 'timeout',
    description: 'Timeout commands',
    type: ApplicationCommandType.ChatInput,
    dmPermission: false,

    options: [
        panther,
    ]
} as ChatCommand
