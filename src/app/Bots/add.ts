import Config from "@lib/config"
import { Client } from "@app/discord"
import { Collections } from "@app/mongo"
import { ValidateClient } from "@lib/discord"

import * as Discord from 'discord.js'


export async function main(interaction) {
    const Data = interaction.options._hoistedOptions

    const Type: string = Data[0].value
    const User: Discord.User = Data[1].user
    const Token: string = Data[2].value
    const Tag: string = Data[3].value.toLowerCase()


    //? Validate the Tag
    if (!/^[a-zA-Z0-9_]+$/.test(Tag)) return interaction.reply({ content: `<@${User.id}>'s Tag is invalid!`, ephemeral: true })
    if (await Collections.Bots.findOne({ tag: Tag })) return interaction.reply({ content: `<@${User.id}> cannot use the tag: "${Tag}" as another bot already has this tag!`, ephemeral: true })


    //? Validate that the User is a Bot
    if (!User.bot) return interaction.reply({ content: `<@${User.id}> is not a bot!`, ephemeral: true })


    //? Validate that the Token is valid to the selected bot
    ValidateClient(User.id, Token)
        .then(() => AddBot(interaction, Type, User, Token, Tag))
        .catch(error => interaction.reply({ content: error, ephemeral: true }))

}



async function AddBot(interaction, Type: string, Bot: Discord.User, Token: string, Tag: string) {
    
    const Guild = Client.guilds.cache.get(Config.discord.guild)
    const User = Guild.members.cache.get(Bot.id) || await Guild.members.fetch(Bot.id)


    //? Check that the Bot is not already in the Database
    const DuplicateCheck = await Collections.Bots.findOne({ id: Bot.id })
    if (DuplicateCheck) return interaction.reply({ content: `<@${Bot.id}> is already in the database!`, ephemeral: true })


    //? Add bot to the database
    Collections.Bots.insertOne({
        type: Type,
        id: Bot.id,
        token: Token,
        tag: Tag,
        enabled: false
    })
        .then(() => interaction.reply({ content: `<@${Bot.id}> was successfully added as a bot to the server!`, ephemeral: true }))
        .catch(error => {
            interaction.reply({ content: `An Error Occurred while attempting to add <@${Bot.id}> to the database!\nPlease read the console logs for more information on the error.`, ephemeral: true })
            console.log(error)
        })

    
    //? Add roles to the bot
    await User.roles.add([Guild.roles.cache.find(role => role.name === 'Bots')])
    
    if (Type === 'game') await User.roles.add([Guild.roles.cache.find(role => role.name === 'Game Servers')])
    if (Type === 'server') await User.roles.add([Guild.roles.cache.find(role => role.name === 'Dedicated Servers')])
}