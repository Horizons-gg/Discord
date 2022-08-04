import * as Discord from 'discord.js'


const Row: any = new Discord.ActionRowBuilder()
    .addComponents(
        new Discord.TextInputBuilder()
            .setCustomId('application.field.deny.reason')
            .setLabel('Reason for Denial')
            .setPlaceholder('E.g. We do not require any staff members in this area at this current time')
            .setStyle(Discord.TextInputStyle.Paragraph)
            .setRequired(true)
    )

export default new Discord.ModalBuilder()
    .setCustomId('application.denyModal')
    .setTitle(`Deny Staff Application`)
    .addComponents(Row)