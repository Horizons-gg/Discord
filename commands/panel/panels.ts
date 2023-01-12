//? Dependencies

import Discord from 'discord.js'

import * as Colors from '@lib/discord/colors'



//? Displays

export const role_selection = (): Discord.MessageCreateOptions => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle('📜 Role Assignment')
                .setDescription('>>> You can select your pronouns, activities, and hosted games to gain access to specified Sections of the Discord.\n\n*Click the Buttons once to receive the roll, and again to remove it.*')
                .setColor(Colors.info)
        ],

        components: [
            new Discord.ActionRowBuilder<Discord.MessageActionRowComponentBuilder>()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId('roles.pronouns')
                        .setPlaceholder('Select your pronouns...')
                        .setMinValues(1)
                        .setMaxValues(3)
                        .addOptions(
                            new Discord.StringSelectMenuOptionBuilder()
                                .setLabel('✨ He / Him')
                                .setValue('he'),

                            new Discord.StringSelectMenuOptionBuilder()
                                .setLabel('💖 She / Her')
                                .setValue('she'),

                            new Discord.StringSelectMenuOptionBuilder()
                                .setLabel('🌈 They / Them')
                                .setValue('they'),

                            new Discord.StringSelectMenuOptionBuilder()
                                .setLabel('❌ None')
                                .setValue('none')
                                .setDescription('Remove all pronouns from your profile'),
                        )

                ),

            new Discord.ActionRowBuilder<Discord.MessageActionRowComponentBuilder>()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('roles-games')
                        .setStyle(Discord.ButtonStyle.Success)
                        .setLabel('Gaming Activities')
                        .setEmoji('🎮'),

                    new Discord.ButtonBuilder()
                        .setCustomId('roles-airsoft')
                        .setStyle(Discord.ButtonStyle.Success)
                        .setLabel('Airsoft Activities')
                        .setEmoji('🎯')
                ),

            new Discord.ActionRowBuilder<Discord.MessageActionRowComponentBuilder>()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('roles-se')
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setLabel('Space Engineers')
                        .setEmoji('🚀'),

                    new Discord.ButtonBuilder()
                        .setCustomId('roles-dayz')
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setLabel('DayZ')
                        .setEmoji('🧟'),

                    new Discord.ButtonBuilder()
                        .setCustomId('roles-mc')
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setLabel('Minecraft')
                        .setEmoji('⚒️')
                )
        ]
    }
}



export const pronouns = (): Discord.MessageCreateOptions => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle('Pronouns')

        ],

        components: [
            new Discord.ActionRowBuilder<Discord.MessageActionRowComponentBuilder>()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId('roles.pronouns')
                        .setPlaceholder('Select your pronouns...')
                        .setMinValues(1)
                        .setMaxValues(3)
                        .addOptions(
                            new Discord.StringSelectMenuOptionBuilder()
                                .setLabel('✨ He / Him')
                                .setValue('he'),

                            new Discord.StringSelectMenuOptionBuilder()
                                .setLabel('💖 She / Her')
                                .setValue('she'),

                            new Discord.StringSelectMenuOptionBuilder()
                                .setLabel('🌈 They / Them')
                                .setValue('they'),

                            new Discord.StringSelectMenuOptionBuilder()
                                .setLabel('❌ None')
                                .setValue('none')
                                .setDescription('Remove all pronouns from your profile'),
                        )

                )
        ]
    }
}

export const supported = (): Discord.MessageCreateOptions => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle('Hosted Games')
        ],

        components: [
            new Discord.ActionRowBuilder<Discord.MessageActionRowComponentBuilder>()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('roles.se')
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setLabel('Space Engineers')
                        .setEmoji('🚀'),

                    new Discord.ButtonBuilder()
                        .setCustomId('roles.dayz')
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setLabel('DayZ')
                        .setEmoji('🧟'),

                    new Discord.ButtonBuilder()
                        .setCustomId('roles.mc')
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setLabel('Minecraft')
                        .setEmoji('⚒️')
                )
        ]
    }
}