const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')


var Votes = []
var Timer = null
var Channel = null
var Interaction = null
var Timeout = null


module.exports = async interaction => {


    //? Timeout Npb for 15 Minutes
    if (interaction.options._subcommand === 'timeout') {

        if (!Timer) {

            var Member = await interaction.guild.members.fetch('463580501857533962').catch(() => console.log('Failed to fetch Npb.'))
            if (Member.communicationDisabledUntilTimestamp) return interaction.reply({ content: 'Npb is Already Timed Out!.', ephemeral: true })

            Votes = [interaction.user.id]
            Timer = Math.floor(new Date().getTime() / 1000 + 300)
            Channel = interaction.channel
            Interaction = interaction

            interaction.reply({
                embeds: [{
                    title: "Timeout Npb for 15 Minutes",
                    color: "#f55742",
                    description: `Type \`/npb timeout\` to add your vote to timeout Npb for 15 minutes.\n\nVotes Remaining to Mute: **${5 - Votes.length}**\n\nVote ends in <t:${Timer}:R>!`,
                }]
            })

            Timeout = setTimeout(Cleanup, 1000 * 300)
        }


        else {
            //if (Votes.includes(interaction.user.id)) return interaction.reply({ content: 'You have already voted to timeout Npb.', ephemeral: true })

            Votes.push(interaction.user.id)

            Interaction.editReply({
                embeds: [{
                    title: "Timeout Npb for 15 Minutes",
                    color: "#f55742",
                    description: `Type \`/npb timeout\` to add your vote to timeout Npb for 15 minutes.\n\nVotes Remaining to Mute: **${5 - Votes.length}**\n\nVote ends in <t:${Timer}:R>!`
                }]
            }).catch(() => {})

            interaction.reply({ content: 'Your vote has been counted!', ephemeral: true })


            if (Votes.length >= 5) {
                clearTimeout(Timeout)

                interaction.guild.members.fetch('463580501857533962').then(member => member.timeout(1000 * 600).catch(() => console.log('Failed to timeout Npb.'))).catch(() => console.log('Failed to fetch Npb.'))
                
                Interaction.deleteReply().catch(() => {})
                Interaction.channel.send({
                    embeds: [{
                        title: "Npb has been Timed Out for 15 Minutes!",
                        color: "#50eb38",
                        description: '🥳 🥳 🥳'
                    }]
                }).then(message => setTimeout(() => message.delete().catch(() => {}), 1000 * 60))

                Cleanup()
            }
        }

    }

}


//? Cleanup
function Cleanup() {

    Interaction.deleteReply().catch(() => console.log('Failed to delete Npb timeout interaction.'))

    Votes = []
    Timer = null
    Channel = null
    Interaction = null
    Timeout = null

}