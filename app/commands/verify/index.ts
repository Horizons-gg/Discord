import Discord, { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js'

import start from './start.ts'
import override from './override.ts'


export default {
    name: 'verify',
    description: 'Manual Verification Commands',
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,

    options: [
        start,
        override
    ]

} as ChatCommand