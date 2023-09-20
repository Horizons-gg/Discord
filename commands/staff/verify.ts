//? Dependencies

import Discord from 'discord.js'

import { User as GetUser } from '@lib/discord'
import { Guild as GetGuild } from '@lib/discord'

import { Messages } from '@lib/discord'

import { initialize as Initialize } from '@lib/discord/common/verify'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('verify')
    .setDescription('Initiate the Account Verification Process on the target account (Use to Filter out Bots)')

    .addUserOption(
        new Discord.SlashCommandUserOption()
            .setName('target')
            .setDescription('Target User')
            .setRequired(true)
    )

    .addIntegerOption(
        new Discord.SlashCommandIntegerOption()
            .setName('time')
            .setDescription('Time to Verify before the user is kicked in minutes')
            .setMinValue(5)
            .setMaxValue(86400)
            .setRequired(false)
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
    const Time = interaction.options.getInteger('time') as number

    Initialize(Target, Time)
        .then(res => Messages.responseStandard(`Verification Process Initiated for ${Target}\n${Target.user.username} will be kicked <t:${Math.floor((new Date().getTime() + ((Time || 15) * 60 * 1000)) / 1000)}:R> if they do not verify their account!\`\`\`Verification Code: ${res}\`\`\``, interaction, 'Verification Process Initiated', true, 'success'))
        .catch(error => Messages.responseStandard(`Verification Process Failed to Initiate for ${Target}\n\`\`\`${error}\`\`\``, interaction, 'Verification Process Failed to Initiate', true, 'danger'))

}