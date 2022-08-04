import * as Discord from 'discord.js'

export const Key = {
    'discord-moderator': 'Discord Moderator',
    'se-moderator': 'Space Engineers Moderator',
    'rust-moderator': 'Rust Moderator',
    'squad-moderator': 'Squad Moderator',
    'mc-moderator': 'Minecraft Moderator',
    'mod-developer': 'Mod Developer',
    'plugin-developer': 'Plugin Developer'
}



//? Preferred Name
const PreferredName: any = new Discord.ActionRowBuilder()
    .addComponents(
        new Discord.TextInputBuilder()
            .setCustomId('application.name')
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
            .setCustomId('application.position')
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
            .setCustomId('application.region')
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
            .setCustomId('application.experience')
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
            .setCustomId('application.statement')
            .setLabel('Statement')
            .setPlaceholder('E.g. I would like to become a moderator in Horizons because...')
            .setRequired(true)
            .setMinLength(50)
            .setMaxLength(800)
            .setStyle(Discord.TextInputStyle.Paragraph)
    )


// //? Staff Position
// const Positions: any = new Discord.ActionRowBuilder()
//     .addComponents(
//         new Discord.SelectMenuBuilder()
//             .setCustomId('application.position')
//             .setPlaceholder('Select a Staff Position')
//             .setMinValues(1)
//             .setMaxValues(1)
//             .setOptions(
//                 {
//                     value: 'discord-moderator',
//                     label: 'Discord Moderator',
//                     emoji: '📱'
//                 },
//                 {
//                     value: 'se-moderator',
//                     label: 'Space Engineers Moderator',
//                     emoji: '🚀'
//                 },
//                 {
//                     value: 'rust-moderator',
//                     label: 'Rust Moderator',
//                     emoji: '🏹'
//                 },
//                 {
//                     value: 'squad-moderator',
//                     label: 'Squad Moderator',
//                     emoji: '🪖'
//                 },
//                 {
//                     value: 'mc-moderator',
//                     label: 'Minecraft Moderator',
//                     emoji: '🔨'
//                 },
//                 {
//                     value: 'mod-developer',
//                     label: 'Mod Developer',
//                     emoji: '💻'
//                 },
//                 {
//                     value: 'plugin-developer',
//                     label: 'Plugin Developer',
//                     emoji: '💻'
//                 }
//             )
//     )


// //? Region
// const Region: any = new Discord.ActionRowBuilder()
//     .addComponents(
//         new Discord.SelectMenuBuilder()
//             .setCustomId('application.region')
//             .setPlaceholder('Select your Region')
//             .setMinValues(1)
//             .setMaxValues(1)
//             .setOptions(
//                 {
//                     value: 'oceania',
//                     label: 'Oceania',
//                 },
//                 {
//                     value: 'united-states',
//                     label: 'United States',
//                 },
//                 {
//                     value: 'europe',
//                     label: 'Europe',
//                 },
//                 {
//                     value: 'other',
//                     label: 'Other',
//                 }

//             )
//     )




export default new Discord.ModalBuilder()
    .setCustomId('application.modal')
    .setTitle('Staff Application')
    .addComponents(PreferredName, Position, Region, Experience, Statement)