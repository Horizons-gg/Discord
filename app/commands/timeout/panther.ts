import App from 'app'
import Discord, { ApplicationCommandOptionType } from 'discord.js'
import { activeVotes, endVote } from '../../interactions/buttons/voteTimeout/index.ts'

const TARGET_USER_ID = '252354071380361218'
const VOTE_DURATION_MS = 60_000

export default {
    name: 'panther',
    description: 'Start a 60-second community vote to timeout Panther',
    type: ApplicationCommandOptionType.Subcommand,

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        const guild = App.guild()
        const target = await guild.members.fetch(TARGET_USER_ID).catch(() => null)

        if (!target) {
            return interaction.reply({ content: 'Could not find that user.', ephemeral: true })
        }

        const endsAt = Math.floor((Date.now() + VOTE_DURATION_MS) / 1000)

        const row = new Discord.ActionRowBuilder<Discord.ButtonBuilder>().addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`voteTimeout.yes.${TARGET_USER_ID}`)
                .setLabel('Yes')
                .setStyle(Discord.ButtonStyle.Danger)
                .setEmoji('✅'),
            new Discord.ButtonBuilder()
                .setCustomId(`voteTimeout.no.${TARGET_USER_ID}`)
                .setLabel('No')
                .setStyle(Discord.ButtonStyle.Secondary)
                .setEmoji('❌'),
        )

        const embed = new Discord.EmbedBuilder()
            .setTitle('Community Timeout Vote')
            .setDescription(`Should **${target.user.username}** be timed out for 60 seconds?\n\nVote ends <t:${endsAt}:R>`)
            .setColor(0xFFA500)
            .addFields(
                { name: '✅ Yes (0)', value: '*No votes yet*', inline: true },
                { name: '❌ No (0)', value: '*No votes yet*', inline: true },
            )

        const reply = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true })

        activeVotes.set(reply.id, {
            yesVoters: new Set(),
            noVoters: new Set(),
            target,
            row,
        })

        setTimeout(() => endVote(reply.id, reply), VOTE_DURATION_MS)
    }
} as ChatSubcommand
