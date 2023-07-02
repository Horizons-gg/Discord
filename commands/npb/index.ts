//? Dependencies

import Discord from 'discord.js'



//? Command

export const command = new Discord.SlashCommandBuilder()
    .setName('npb')
    .setDescription('Timeout Npb123 for 15 minutes')
    .setDMPermission(false)



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const Member = await interaction.guild?.members.fetch('463580501857533962')
    if (!Member) return interaction.reply({ content: 'Failed to find Npb123!', ephemeral: true })

    if (Member.communicationDisabledUntilTimestamp) return Member.timeout(null, `${interaction.user.username} has removed Npb's Timeout`).then(() => interaction.reply({ content: `Npb's timeout was removed by ${interaction.user}... 😒` })).catch(error => interaction.reply({ content: `${error}`, ephemeral: true }))

    Member.timeout(900000, 'Shut up Npb!')
        .then(() => interaction.reply({ content: '<@463580501857533962> has been timed out for 15 minutes! 🥳' }))
        .catch(error => interaction.reply({ content: `${error}`, ephemeral: true }))

}