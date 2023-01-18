//? Dependencies

import Discord from 'discord.js'

import { Messages, Colors } from '@lib/discord'



//? Handle

export default async function (interaction: Discord.ModalSubmitInteraction) {

    const PingRole = interaction.guild!.roles.cache.find(role => role.name === 'Staff') as Discord.Role
    const FormsChannel = interaction.guild!.channels.cache.find(channel => channel.name === '📰forms') as Discord.TextChannel
    if (!FormsChannel) return Messages.responseError('The `📰forms` channel does not exist.', interaction, 'Failed to Submit Report')


    const Form = new Discord.EmbedBuilder()
        .setTitle('⚠️ Member Report')
        .setAuthor({ name: `Report Submitted by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL() || 'https://archive.org/download/discordprofilepictures/discordblue.png' })
        .setDescription(`**Submit by <@${interaction.user.id}>**\`\`\`${interaction.fields.getTextInputValue('reason')}\`\`\`\n_ _`)
        .setColor(Colors.danger)
        .setTimestamp(new Date())

        .addFields(
            { name: 'Reported Member', value: `\`${interaction.fields.getTextInputValue('reported')}\``, inline: true },
            { name: 'Related Service', value: `\`${interaction.fields.getTextInputValue('service')}\``, inline: true },
            { name: 'Region', value: `\`${interaction.fields.getTextInputValue('region') || 'N/A'}\``, inline: true }
        )



    const Actions = new Discord.ActionRowBuilder<Discord.MessageActionRowComponentBuilder>()
        .addComponents(
            new Discord.ButtonBuilder()
                .setLabel('Message')
                .setStyle(Discord.ButtonStyle.Link)
                .setEmoji('📨')
                .setURL(`discord://-/users/${interaction.user.id}`)
        )


    FormsChannel.send({ content: PingRole.toString(), embeds: [Form], components: [Actions] })
        .then(() => Messages.responseStandard('Your report has been submitted, please be patient while our staff look into your report.\n\n*You will be contacted if any further information is required.*', interaction, '✅ Report Submitted', true, 'success'))
        .catch(err => Messages.responseError(err, interaction, 'Error while Submitting Report'))
}