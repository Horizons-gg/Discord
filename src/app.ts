//!
//! External Modules
//!

import Config from "@lib/config"

import * as Discord from "discord.js"



//!
//! Initialize App
//!

import {connect as ConnectMongo} from '@app/mongo'
import { connect as ConnectExpress } from '@app/express'
import { connect as ConnectDiscord } from '@app/discord'

ConnectMongo()
ConnectExpress()
ConnectDiscord()



//!
//! App Ready
//!

import { Client } from '@app/discord'

import * as Events from './Events'
import * as Commands from './Commands'
import * as Interfaces from '@interfaces/index'
import * as Notifications from './Notifications'



//? Notifications
Client.on('guildMemberAdd', (member) => Notifications.guildMemberAdd(member))
Client.on('guildMemberRemove', (member) => Notifications.guildMemberRemove(member))


//? Interactions
Client.on('interactionCreate', (interaction: any) => {

    //? Commands
    try {
        if (interaction.type === Discord.InteractionType.ApplicationCommand) Commands.SlashCommands[interaction.commandName](interaction)
    } catch {
        console.log(`Command "${interaction.commandName}" not found`)
        interaction.reply({ content: 'An error occurred while processing your command, this command may no longer be in use or is not yet implemented.', ephemeral: true })
    }


    //? Interfaces
    if (!interaction.customId) return
    const Flag = interaction.customId.split('.') || interaction.customId

    try {
        Interfaces[Flag[0]][Flag[1]](interaction, Flag)
    } catch {
        console.log(`[ERROR] Unknown Interface: ${Flag[0]}.${Flag[1]}`)
        interaction.reply({ content: 'An error occurred while processing your command, this command may no longer be in use or is not yet implemented.', ephemeral: true })
    }

})


//? Messages
Client.on('messageCreate', message => {

    const Channel: any = message.channel


    //? Add Messages to Ticket History
    if ([Config.ticket.open, Config.ticket.closed].includes(Channel.parentId)) Events.MessageCreate.Tickets(message)

})