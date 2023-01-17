//? Dependencies

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'

import { Messages, Colors } from '@lib/discord'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('topactivities')
    .setDescription('List the Top Activities from Users in the Discord')

    .addStringOption(option => option
        .setName('timeframe')
        .setDescription('The Time Frame to Generate the List')
        .setRequired(true)

        .addChoices(
            { name: 'Past Day', value: 'day' },
            { name: 'Past Week', value: 'week' },
            { name: 'Past Month', value: 'month' }
        )
    )

    .addStringOption(option => option
        .setName('sortby')
        .setDescription('How the List Should be Sorted')

        .addChoices(
            { name: 'Score', value: 'score' },
            { name: 'Participants', value: 'participants' }
        )
    )

    .addIntegerOption(option => option
        .setName('limit')
        .setDescription('Maximum Number of Activities to List')
        .setRequired(false)

        .setMinValue(1)
        .setMaxValue(50)
    )

    .addBooleanOption(option => option
        .setName('ephemeral')
        .setDescription('If this option is set to true, the list will only be visible to you')
        .setRequired(false)
    )



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const Limit = interaction.options.getInteger('limit') || 10


    const TopActivities: { name: string, score: number, participants: number }[] = []

    const Users = await (await Collection('users')).find().toArray() as Member[]


    for (const User of Users) {
        User.activities.forEach(activity => {

            let valid = 0

            for (const log of activity.logged) {
                switch (interaction.options.getString('timeframe')) {
                    case 'day':
                        if (log.getTime() > Date.now() - (1000 * 60 * 60 * 24)) valid++
                        break;

                    case 'week':
                        if (log.getTime() > Date.now() - (1000 * 60 * 60 * 24 * 7)) valid++
                        break;

                    case 'month':
                        if (log.getTime() > Date.now() - (1000 * 60 * 60 * 24 * 30)) valid++
                        break;
                }
            }


            const ActivityIndex = TopActivities.findIndex(a => a.name === activity.name)
            if (ActivityIndex == -1) TopActivities.push({ name: activity.name, score: valid, participants: 1 })
            else TopActivities[ActivityIndex].score += valid, TopActivities[ActivityIndex].participants++

        })
    }



    //! Generate List Embed

    const Embed = new Discord.EmbedBuilder().setColor(Colors.info)
    const SortedActivities = (interaction.options.getString('sortby') == 'participants' ? TopActivities.sort((a, b) => b.participants - a.participants) : TopActivities.sort((a, b) => b.score - a.score)).splice(0, Limit)

    if (SortedActivities.length > 1) Embed.setTitle(`Top ${Limit} Activities in Horizons - Sorted by ${interaction.options.getString('sortby') == 'participants' ? 'Participants' : 'Score'}`)
    else Embed.setTitle(`Top Activity in Horizons`)

    switch (interaction.options.getString('timeframe')) {
        case 'day':
            Embed.setTitle(`${Embed.data.title} - 24 Hours`)
            break;

        case 'week':
            Embed.setTitle(`${Embed.data.title} - 7 Days`)
            break;

        case 'month':
            Embed.setTitle(`${Embed.data.title} - 30 Days`)
            break;
    }



    const List = SortedActivities.map((a, i) => {

        const Layout: { value: string, limit: number }[] = [
            { value: `${i + 1}.`, limit: 5 },
            { value: a.name, limit: 25 },
            { value: `${a.score} pts`, limit: 15 },
            { value: `${a.participants} pax`, limit: 15 }
        ]

        const Line = Layout.map(p => {

            if (p.value.length > p.limit) p.value = p.value.slice(0, p.limit - 3) + '...'

            while (p.value.length < p.limit) p.value += ' '

            return p.value

        })


        return Line.join(' | ')

    })

    Embed.setDescription(`\`\`\`Index |          Activity         |      Score      |   PAX\n-------------------------------------------------------------\n${List.join('\n')}\`\`\``)



    const Message: Discord.InteractionReplyOptions = {
        embeds: [Embed],
        ephemeral: interaction.options.getBoolean('ephemeral') || true
    }

    interaction.reply(Message)
        .catch(err => Messages.responseError(err, interaction, 'Failed to Send Top Activities List'))

}