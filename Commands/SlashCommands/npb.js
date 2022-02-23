const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')


var Votes = []
var Timer = null
var Channel = null
var Interaction = null
var Timeout = null


module.exports = async interaction => {


    //? Timeout Npb for 10 Minutes
    if (interaction.options._subcommand === 'timeout') {

        if (!Timer) {
            Votes = [interaction.user.id]
            Timer = Math.floor(new Date().getTime() / 1000 + 600)
            Channel = interaction.channel
            Interaction = interaction

            interaction.reply({
                embeds: [{
                    title: "Timeout Npb for 10 Minutes",
                    color: "#f55742",
                    description: `Type \`/npb timeout\` to add your vote to timeout Npb for 10 minutes.\n\nVotes Remaining to Mute: **${5 - Votes.length}**\n\nVote ends in <t:${Timer}:R>!`,
                }]
            })

            Timeout = setTimeout(Cleanup, 1000 * 600)
        }


        else {
            if (Votes.includes(interaction.user.id)) return interaction.reply({ content: 'You have already voted to timeout Npb.', ephemeral: true })

            Votes.push(interaction.user.id)

            Interaction.editReply({
                embeds: [{
                    title: "Timeout Npb for 10 Minutes",
                    color: "#f55742",
                    description: `Type \`/npb timeout\` to add your vote to timeout Npb for 10 minutes.\n\nVotes Remaining to Mute: **${5 - Votes.length}**\n\nVote ends in <t:${Timer}:R>!`
                }]
            })

            interaction.reply({ content: 'Your vote has been counted!', ephemeral: true })


            if (Votes.length >= 5) {
                clearTimeout(Timeout)

                interaction.guild.members.fetch('463580501857533962').then(member => member.timeout(1000 * 600)).catch(() => console.log('Failed to timeout Npb.')).catch(() => console.log('Failed to fetch Npb.'))
                
                Interaction.editReply({
                    embeds: [{
                        title: "Npb has been Timed Out for 10 Minutes!",
                        color: "#50eb38",
                        description: '🥳 🥳 🥳'
                    }]
                }).then(interaction => setTimeout(() => interaction.deleteReply(), 1000 * 60))
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