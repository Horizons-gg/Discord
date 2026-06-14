import Discord from 'discord.js'

const TIMEOUT_DURATION_MS = 60_000

export interface VoteState {
    yesVoters: Set<string>
    noVoters: Set<string>
    target: Discord.GuildMember
    row: Discord.ActionRowBuilder<Discord.ButtonBuilder>
}

export const activeVotes = new Map<string, VoteState>()

function voterList(voters: Set<string>) {
    if (voters.size === 0) return '*No votes yet*'
    return [...voters].map(id => `<@${id}>`).join('\n')
}

export async function endVote(messageId: string, message: Discord.Message) {
    const state = activeVotes.get(messageId)
    if (!state) return
    activeVotes.delete(messageId)

    const { yesVoters, noVoters, target, row } = state
    const passed = yesVoters.size > noVoters.size

    const disabledRow = new Discord.ActionRowBuilder<Discord.ButtonBuilder>().addComponents(
        ...row.components.map(btn =>
            Discord.ButtonBuilder.from(btn.toJSON()).setDisabled(true)
        )
    )

    const resultEmbed = Discord.EmbedBuilder.from(message.embeds[0])
        .setColor(passed ? 0xFF0000 : 0x00AA00)
        .setDescription(
            passed
                ? `Vote passed! **${target.user.username}** has been timed out for 60 seconds.`
                : `Vote failed. **${target.user.username}** was not timed out.`
        )
        .setFields(
            { name: `✅ Yes (${yesVoters.size})`, value: voterList(yesVoters), inline: true },
            { name: `❌ No (${noVoters.size})`, value: voterList(noVoters), inline: true },
        )

    await message.edit({ embeds: [resultEmbed], components: [disabledRow] })

    if (passed) {
        await target.timeout(TIMEOUT_DURATION_MS, `Community vote: ${yesVoters.size} yes vs ${noVoters.size} no`).catch(console.error)
    }

    setTimeout(() => message.delete().catch(console.error), 5000)
}

export default async function voteTimeout(interaction: Discord.ButtonInteraction, args: string[]) {
    const [vote] = args
    const messageId = interaction.message.id
    const state = activeVotes.get(messageId)

    if (!state) {
        return interaction.reply({ content: 'This vote has already ended.', ephemeral: true })
    }

    const userId = interaction.user.id
    state.yesVoters.delete(userId)
    state.noVoters.delete(userId)

    if (vote === 'yes') state.yesVoters.add(userId)
    else state.noVoters.add(userId)

    const updatedEmbed = Discord.EmbedBuilder.from(interaction.message.embeds[0])
        .setFields(
            { name: `✅ Yes (${state.yesVoters.size})`, value: voterList(state.yesVoters), inline: true },
            { name: `❌ No (${state.noVoters.size})`, value: voterList(state.noVoters), inline: true },
        )

    await interaction.update({ embeds: [updatedEmbed], components: [state.row] })
}
