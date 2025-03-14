import Discord, { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js'
import App from 'app'
import Messages from "lib/messages.ts"

import CheckPerms from "./check.ts"


export default {
    name: 'edit',
    description: 'Edit your voice channel',
    type: ApplicationCommandOptionType.Subcommand,

    options: [
        {
            name: 'name',
            description: 'Change the name of your voice channel',
            type: ApplicationCommandOptionType.String,
            required: false,
            minLength: 2,
            maxLength: 15
        },
        {
            name: 'limit',
            description: 'Change the user limit of your voice channel',
            type: ApplicationCommandOptionType.Integer,
            required: false,
            minValue: 1,
            maxValue: 99
        },
        {
            name: 'ptt',
            description: 'Enable Push-to-Talk for your voice channel',
            type: ApplicationCommandOptionType.Boolean,
            required: false
        }
    ],

    async execute(interaction) {
        const isAuth = await CheckPerms(interaction)
        if (!isAuth) return

        const member = interaction.member as Discord.GuildMember
        const channel = member.voice.channel as Discord.VoiceChannel

        const name = interaction.options.getString('name')
        const limit = interaction.options.getInteger('limit')
        const ptt = interaction.options.getBoolean('ptt')

        try {
            if (name) channel.setName(name)
            if (limit) channel.setUserLimit(limit)
            if (ptt) channel.permissionOverwrites.edit(App.guild().id, { UseVAD: ptt })
            Messages.reply(interaction, { description: '✅ Your channel has been updated.', color: 'success', ephemeral: true })
        } catch (error) {
            Messages.reply(interaction, { title: '❌ Unable to update your channel.', description: (error as Error).message, color: 'danger', ephemeral: true })
        }
    }
} as ChatSubcommand