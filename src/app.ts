//!
//! External Modules
//!

import * as Discord from "discord.js"



//!
//! Discord.js
//!

import { connect as ConnectToDiscord } from '@app/discord'
ConnectToDiscord()



//!
//! MongoDb
//!

import * as Mongo from '@app/mongo'
Mongo.connect()



//!
//! App Ready
//!

import { Client } from '@app/discord'

import * as Commands from './Commands'
import * as Interfaces from './Interfaces'
import * as Notifications from './Notifications'



//? Notifications
Client.on('guildMemberAdd', (member) => Notifications.guildMemberAdd(member))
Client.on('guildMemberRemove', (member) => Notifications.guildMemberRemove(member))


//? Interactions
Client.on('interactionCreate', (interaction: any) => {

    //? Commands
    if (interaction.type === Discord.InteractionType.ApplicationCommand) Commands.SlashCommands[interaction.commandName](interaction)


    //? Interfaces
    if (!interaction) return
    const Flag = interaction.customId.split('-') || interaction.customId



})