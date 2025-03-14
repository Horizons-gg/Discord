import Discord, { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js'


import open from './open.ts'
import close from './close.ts'
import add from './add.ts'
import remove from './remove.ts'


export default {
    name: 'ticket',
    description: 'Ticket Commands',
    type: ApplicationCommandType.ChatInput,
    dmPermission: false,

    options: [
        open,
        close,
        add,
        remove,
    ]
} as ChatCommand