//? Dependencies

import Discord from 'discord.js'



//? Command

export const command = new Discord.SlashCommandBuilder()
    .setName('panel')
    .setDescription('Panel Commands')
    .setDMPermission(false)
    .setDefaultMemberPermissions(8)



//? Response

export const response = (interaction: Discord.ChatInputCommandInteraction) => {

    const Modal = new Discord.ModalBuilder()
        .setTitle('Test Modal')
        .setCustomId('test')

        .addComponents(

            new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>()
                .addComponents(

                    new Discord.TextInputBuilder()
                        .setLabel('Daniels a Fat German Nazi')
                        .setStyle(Discord.TextInputStyle.Short)
                        .setCustomId('daniel')

                )

        )


    interaction.showModal(Modal)

}