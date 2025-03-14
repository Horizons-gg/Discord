import Discord, { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js'
import App from 'app'
import Messages from "lib/messages.ts"

import CheckPerms from "./check.ts"


export default {
    name: 'unlock',
    description: 'Unlock your voice channel',
    type: ApplicationCommandOptionType.Subcommand,

    async execute(interaction) {
        const isAuth = await CheckPerms(interaction)
        if (!isAuth) return

        const member = interaction.member as Discord.GuildMember
        const channel = member.voice.channel as Discord.VoiceChannel

        channel.permissionOverwrites.edit(App.guild().id, { Connect: true })
            .then(() => Messages.reply(interaction, { description: '🔓 Your channel has been unlocked.', color: 'success', ephemeral: true }))
            .catch(() => Messages.reply(interaction, { description: '❌ Unable to unlock your channel.', color: 'danger', ephemeral: true }))
    }
} as ChatSubcommand