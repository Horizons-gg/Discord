import Discord, { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js'
import App from 'app'
import Messages from "lib/messages.ts"

import CheckPerms from "./check.ts"


export default {
    name: 'lock',
    description: 'Lock your voice channel',
    type: ApplicationCommandOptionType.Subcommand,

    async execute(interaction) {
        const isAuth = await CheckPerms(interaction)
        if (!isAuth) return

        const member = interaction.member as Discord.GuildMember
        const channel = member.voice.channel as Discord.VoiceChannel

        channel.permissionOverwrites.edit(App.guild().id, { Connect: false })
            .then(() => Messages.reply(interaction, { description: '🔒 Your channel has been locked.', color: 'success', ephemeral: true }))
            .catch(() => Messages.reply(interaction, { description: '❌ Unable to lock your channel.', color: 'danger', ephemeral: true }))
    }
} as ChatSubcommand