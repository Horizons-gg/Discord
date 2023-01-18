//? Dependencies

import Discord from 'discord.js'

import { Messages, Colors } from '@lib/discord'



//? Handle

export default async function (interaction: Discord.ModalSubmitInteraction) {

    const PingRole = interaction.guild!.roles.cache.find(role => role.name === 'Management') as Discord.Role
    const FormsChannel = interaction.guild!.channels.cache.find(channel => channel.name === '📰forms') as Discord.TextChannel
    if (!FormsChannel) return Messages.responseError('The `📰forms` channel does not exist.', interaction, 'Failed to Submit Application')


    const Form = new Discord.EmbedBuilder()
        .setTitle('📝 Staff Application')
        .setAuthor({ name: `Application Submitted by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL() || 'https://archive.org/download/discordprofilepictures/discordblue.png' })
        .setDescription(`**Submit by <@${interaction.user.id}>**\n\n**Statement**\`\`\`${interaction.fields.getTextInputValue('statement')}\`\`\`\n**Past Experience**\`\`\`${interaction.fields.getTextInputValue('experience')}\`\`\`\n_ _`)
        .setColor(Colors.primary)
        .setTimestamp(new Date())

        .addFields(
            { name: 'Preferred Name', value: `\`${interaction.fields.getTextInputValue('name')}\``, inline: true },
            { name: 'Position', value: `\`${interaction.fields.getTextInputValue('position')}\``, inline: true },
            { name: 'Region', value: `\`${interaction.fields.getTextInputValue('region')}\``, inline: true }
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
        .then(() => Messages.responseStandard('Your application has been submitted, please be patient whilst management reads through your application.\n\n*We will be in contact with you soon!*', interaction, '✅ Application Submitted', true, 'success'))
        .catch(err => Messages.responseError(err, interaction, 'Error while Submitting Application'))
}