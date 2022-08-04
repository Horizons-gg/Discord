import * as Discord from 'discord.js'



//? Preferred Name
const PreferredName: any = new Discord.ActionRowBuilder()
    .addComponents(
        new Discord.TextInputBuilder()
            .setCustomId('application.field.name')
            .setLabel('Preferred Name')
            .setPlaceholder('John Doe...')
            .setRequired(true)
            .setMaxLength(32)
            .setStyle(Discord.TextInputStyle.Short)
    )


//? Position
const Position: any = new Discord.ActionRowBuilder()
    .addComponents(
        new Discord.TextInputBuilder()
            .setCustomId('application.field.position')
            .setLabel('Staff Position')
            .setPlaceholder('Discord Moderator, Space Engineers Moderator, etc...')
            .setRequired(true)
            .setMaxLength(32)
            .setStyle(Discord.TextInputStyle.Short)
    )


//? Region
const Region: any = new Discord.ActionRowBuilder()
    .addComponents(
        new Discord.TextInputBuilder()
            .setCustomId('application.field.region')
            .setLabel('Region')
            .setPlaceholder('Australia, United States, Europe, etc...')
            .setRequired(true)
            .setMaxLength(32)
            .setStyle(Discord.TextInputStyle.Short)
    )


//? Experience
const Experience: any = new Discord.ActionRowBuilder()
    .addComponents(
        new Discord.TextInputBuilder()
            .setCustomId('application.field.experience')
            .setLabel('Past Experience')
            .setPlaceholder('E.g. I have been a moderator on "Other Server" for 2 years...')
            .setRequired(true)
            .setMinLength(20)
            .setMaxLength(800)
            .setStyle(Discord.TextInputStyle.Paragraph)
    )


//? Statement
const Statement: any = new Discord.ActionRowBuilder()
    .addComponents(
        new Discord.TextInputBuilder()
            .setCustomId('application.field.statement')
            .setLabel('Statement')
            .setPlaceholder('E.g. I would like to become a moderator in Horizons because...')
            .setRequired(true)
            .setMinLength(50)
            .setMaxLength(800)
            .setStyle(Discord.TextInputStyle.Paragraph)
    )



export default new Discord.ModalBuilder()
    .setCustomId('application.submit')
    .setTitle('Staff Application')
    .addComponents(PreferredName, Position, Region, Experience, Statement)