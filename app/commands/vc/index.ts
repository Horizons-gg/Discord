import Discord, { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js'

import lock from './lock.ts'
import unlock from "./unlock.ts"
import edit from "./edit.ts"
import kick from "./kick.ts"


export default {
    name: 'vc',
    description: 'Voice Channel Commands',
    type: ApplicationCommandType.ChatInput,
    dmPermission: false,

    options: [
        lock,
        unlock,
        edit,
        kick
    ]
} as ChatCommand