//? Dependencies

import Config from '@lib/config'

import Discord from 'discord.js'

import { User as GetUser } from '@lib/discord'
import { Guild as GetGuild } from '@lib/discord'

import { Messages, Colors } from '@lib/discord'

import { override as Override } from '@lib/discord/common/verify'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('override')
    .setDescription('Override a Users Verification Process')
    .addUserOption(
        new Discord.SlashCommandUserOption()
            .setName('target')
            .setDescription('Target User')
            .setRequired(true)
    )



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    //? Verify that the User is an Administrator

    const Guild = await GetGuild()
    const User = await GetUser(interaction.user.id)
    const Administrator = Guild.roles.cache.find(r => r.name == 'Administrator') as Discord.Role

    if (!User || !User.roles.cache.has(Administrator.id)) return


    //? Continue Process

    const Target = interaction.options.getMember('target') as Discord.GuildMember
    const GeneralChannel = Guild.channels.cache.find(channel => channel.name == "🌐general") as Discord.TextBasedChannel

    Override(Target.id)
        .then(() => {
            Messages.responseStandard(`Verification Process Overridden for ${Target}!`, interaction, 'Verification Process Overridden!', true, 'success')

            Target.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle('Account Verification Overridden!')
                        .setDescription(`An Administrator has overridden your Account Verification Session, you no longer need to enter your verification code and may continue to use Horizons as per usual!`)
                        .setColor(Colors.info)
                ]
            }).catch(() => {
                GeneralChannel.send({
                    content: `${Target}`,
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle('Account Verification Overridden!')
                            .setDescription(`An Administrator has overridden your Account Verification Session, you no longer need to enter your verification code and may continue to use Horizons as per usual!`)
                            .setColor(Colors.info)
                    ]
                }).then(msg => setTimeout(() => { msg.delete().catch(() => { }) }, 1000 * 60 * 5))
            })
        })
        .catch(error => Messages.responseStandard(`Failed to Override Account Verification for ${Target}!\n\`\`\`${error}\`\`\``, interaction, 'Failed to Override Account Verification!', true, 'danger'))

}