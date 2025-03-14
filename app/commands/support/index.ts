import Discord, { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js'


import ticket from './ticket.ts'
import panel from './panel.ts'
import application from './application.ts'
import report from './report.ts'


export default {
    name: 'support',
    description: 'Commands to Seek Support in Horizons',
    type: ApplicationCommandType.ChatInput,
    dmPermission: false,
    
    options: [
        ticket,
        panel,
        application,
        report,
    ]
} as ChatCommand