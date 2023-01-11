//? Dependencies

import Discord from 'discord.js'



//? Modal

export default new Discord.ModalBuilder()
    .setTitle('Support Ticket')
    .setCustomId('ticket')

    .addComponents(

        new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>()
            .addComponents(
                new Discord.TextInputBuilder()
                    .setLabel('Title of your Issue')
                    .setStyle(Discord.TextInputStyle.Short)
                    .setCustomId('title')

                    .setPlaceholder('E.g. My Ship Vanished!')
                    .setMinLength(3)
                    .setMaxLength(50)

                    .setRequired(true)
            ),

        new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>()
            .addComponents(
                new Discord.TextInputBuilder()
                    .setLabel('The Service your Issue is Related to')
                    .setStyle(Discord.TextInputStyle.Short)
                    .setCustomId('service')

                    .setPlaceholder('Space Engineers, Discord, Software (TorchJs), etc.')
                    .setMinLength(3)
                    .setMaxLength(30)

                    .setRequired(true)
            ),

        new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>()
            .addComponents(
                new Discord.TextInputBuilder()
                    .setLabel('The Region your Issue is Related to')
                    .setStyle(Discord.TextInputStyle.Short)
                    .setCustomId('region')

                    .setPlaceholder('Australia, Europe, United States, etc.')
                    .setMinLength(3)
                    .setMaxLength(30)

                    .setRequired(false)
            ),

        new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>()
            .addComponents(
                new Discord.TextInputBuilder()
                    .setLabel('Briefly Describe your Issue')
                    .setStyle(Discord.TextInputStyle.Paragraph)
                    .setCustomId('description')

                    .setPlaceholder('E.g. I joined the server and my ship was gone!')
                    .setMinLength(20)
                    .setMaxLength(800)

                    .setRequired(true)
            )

    )