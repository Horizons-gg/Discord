import App from 'app'
import Discord, { ApplicationCommandOptionType } from 'discord.js'

const TARGET_USER_ID = '252354071380361218'
const VOTE_DURATION_MS = 60_000
const TIMEOUT_DURATION_MS = 60_000

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

        const embed = new Discord.EmbedBuilder()
            .setTitle('Community Timeout Vote')
            .setDescription(`Should **${target.user.username}** be timed out for 60 seconds?\n\nVote ends <t:${endsAt}:R>`)
            .setColor(0xFFA500)
            .addFields(
                { name: '✅ Yes', value: '0 votes', inline: true },
                { name: '❌ No', value: '0 votes', inline: true },
            )

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

        const reply = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true })

        const yesVoters = new Set<string>()
        const noVoters = new Set<string>()

        const collector = reply.createMessageComponentCollector({
            componentType: Discord.ComponentType.Button,
            time: VOTE_DURATION_MS,
        })

        collector.on('collect', async (btn: Discord.ButtonInteraction) => {
            const vote = btn.customId.split('.')[1]
            const userId = btn.user.id

            yesVoters.delete(userId)
            noVoters.delete(userId)

            if (vote === 'yes') yesVoters.add(userId)
            else noVoters.add(userId)

            const updatedEmbed = Discord.EmbedBuilder.from(btn.message.embeds[0])
                .setFields(
                    { name: '✅ Yes', value: `${yesVoters.size} vote${yesVoters.size !== 1 ? 's' : ''}`, inline: true },
                    { name: '❌ No', value: `${noVoters.size} vote${noVoters.size !== 1 ? 's' : ''}`, inline: true },
                )

            await btn.update({ embeds: [updatedEmbed], components: [row] })
        })

        collector.on('end', async () => {
            const disabledRow = new Discord.ActionRowBuilder<Discord.ButtonBuilder>().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`voteTimeout.yes.${TARGET_USER_ID}`)
                    .setLabel('Yes')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setEmoji('✅')
                    .setDisabled(true),
                new Discord.ButtonBuilder()
                    .setCustomId(`voteTimeout.no.${TARGET_USER_ID}`)
                    .setLabel('No')
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setEmoji('❌')
                    .setDisabled(true),
            )

            const passed = yesVoters.size > noVoters.size

            const resultEmbed = Discord.EmbedBuilder.from(reply.embeds[0])
                .setColor(passed ? 0xFF0000 : 0x00AA00)
                .setDescription(
                    passed
                        ? `Vote passed! **${target.user.username}** has been timed out for 60 seconds.\n\n✅ Yes: ${yesVoters.size} | ❌ No: ${noVoters.size}`
                        : `Vote failed. **${target.user.username}** was not timed out.\n\n✅ Yes: ${yesVoters.size} | ❌ No: ${noVoters.size}`
                )

            await reply.edit({ embeds: [resultEmbed], components: [disabledRow] })

            if (passed) {
                await target.timeout(TIMEOUT_DURATION_MS, `Community vote: ${yesVoters.size} yes vs ${noVoters.size} no`).catch(console.error)
            }
        })
    }
} as ChatSubcommand
