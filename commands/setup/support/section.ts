//? Dependencies

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('section')
    .setDescription('Set the Support Sections for the Server')

    .addChannelOption(option => option
        .setName('opened')
        .setDescription('Category for Opened Tickets')
        .addChannelTypes(Discord.ChannelType.GuildCategory)
        .setRequired(true)
    )

    .addChannelOption(option => option
        .setName('closed')
        .setDescription('Category for Closed Tickets')
        .addChannelTypes(Discord.ChannelType.GuildCategory)
        .setRequired(true)
    )

    .addRoleOption(option => option
        .setName('onduty')
        .setDescription('On Duty Role')
        .setRequired(true)
    )

    .addRoleOption(option => option
        .setName('receivingsupport')
        .setDescription('Receiving Support Role')
        .setRequired(true)
    )



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const Setup = await Collection('setup')
    const Support = (await Setup.findOne({ _id: 'support' }) || { _id: 'support' }) as Support


    Support.onDutyRole = interaction.options.getRole('onduty', true).id
    Support.receivingSupportRole = interaction.options.getRole('receivingsupport', true).id

    Support.sections = {
        opened: interaction.options.getChannel('opened', true).id,
        closed: interaction.options.getChannel('closed', true).id
    }
    

    Setup.updateOne({ _id: 'support' }, { $set: Support }, { upsert: true })
        .then(() => interaction.reply({ content: 'Support Sections have been set!', ephemeral: true }))
        .catch(err => interaction.reply({ content: `\`\`\`${err}\`\`\``, ephemeral: true }))

}