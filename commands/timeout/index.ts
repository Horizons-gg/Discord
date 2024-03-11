//? Dependencies

import Discord from 'discord.js'



//? Command

export const command = new Discord.SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout annoying members')
    .setDMPermission(false)

    .addStringOption(option => option
        .setName('member')
        .setDescription('Select a member to timeout')
        .setRequired(true)
        .addChoices(
            { name: 'Npb123', value: '463580501857533962' },
            { name: 'Slaughterer', value: '269773335716429825' },
            { name: 'Firedbike', value: '860470498705145866' },
        )
    )

    .addStringOption(option => option
        .setName('length')
        .setDescription('Select the length of the timeout')
        .setRequired(true)
        .addChoices(
            { name: '60 seconds', value: '60000,60 Seconds,Donator' },
            { name: '5 minutes', value: '300000,5 Minutes,Donator' },
            { name: '15 minutes', value: '900000,15 Minutes,Donator' },
            { name: '30 minutes', value: '1800000,30 Minutes,Nitro Booster' },
            { name: '1 hour', value: '3600000,1 Hour,Patreon' },
            { name: '3 hours', value: '10800000,3 Hours,Emerald Tier' },
            { name: 'Remove Timeout', value: '1,Remove Timeout,Donator' }
        )
    )



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const Guild = interaction.guild
    if (!Guild) return interaction.reply({ content: `Failed to verify guild: "${interaction.guildId || 0}"`, ephemeral: true })

    const InteractingMember = Guild.members.cache.get(interaction.user.id)
    if (!InteractingMember) return interaction.reply({ content: `Failed to verify interacting member: <@${interaction.user.id || 0}>`, ephemeral: true })

    const MemberId = interaction.options.getString('member')
    if (!MemberId) return interaction.reply({ content: `Failed to fetch ID: <@${MemberId || 0}>`, ephemeral: true })

    const Member = Guild.members.cache.get(MemberId)
    if (!Member) return interaction.reply({ content: `Failed to fetch member: <@${MemberId || 0}>`, ephemeral: true })


    const timeoutRaw = interaction.options.getString('length')?.split(',') || ['60000', '60 Seconds', 'Donator']
    const timeoutLength = parseInt(timeoutRaw[0] || '60000')
    
    const minRoleRaw = timeoutRaw[2]
    const minRole = Guild.roles.cache.find(role => role.name === minRoleRaw)

    if (!minRole) return interaction.reply({ content: `Failed to verify role: "${minRoleRaw}"`, ephemeral: true })

    if (InteractingMember.roles.highest.rawPosition < minRole.rawPosition) return interaction.reply({ content: `The minimum role required to timeout a user for **${timeoutRaw[1]}** is ${minRole}`, ephemeral: true })


    if (timeoutRaw[1] === 'Remove Timeout') return Member.timeout(timeoutLength, `${interaction.user.username} has removed ${Member.user.username} Timeout`).then(() => interaction.reply({ content: `${Member.user.username}'s timeout was removed by ${interaction.user}... 😒` })).catch(error => interaction.reply({ content: `Error: ${error}`, ephemeral: true }))


    Member.timeout(timeoutLength, `${interaction.user.username} has timed out ${Member.user.username} for ${timeoutRaw[1]}`)
        .then(() => interaction.reply({ content: `${Member} has been timed out for ${timeoutRaw[1]}! 🥳` }))
        .catch(error => interaction.reply({ content: `Error: ${error}`, ephemeral: true }))

}