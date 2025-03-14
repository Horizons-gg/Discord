import Discord, { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js'


export default {
    name: 'joke',
    description: 'Tell a joke',
    type: ApplicationCommandType.ChatInput,

    options: [
        {
            name: 'keyword',
            description: 'Keyword to search for a joke',
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],

    async execute(interaction) {
        const keyword = interaction.options.getString('keyword')

        const joke: { type: 'single' | 'twopart', setup: string, delivery: string, joke: string } = await fetch(`https://v2.jokeapi.dev/joke/Any${keyword ? `?contains=${keyword}` : ''}`)
            .then(res => res.json())
            .then(json => {
                if (json.error) return interaction.reply({ content: `Sorry... I couldn't find any jokes matching your keyword.`, ephemeral: true })
                return json
            })
            .catch(err => {
                interaction.reply({ content: `An error occurred: ${err}`, ephemeral: true })
            })

        if (joke.type === 'single') {
            interaction.reply({ content: joke.joke })
        }

        if (joke.type === 'twopart') {
            const channel = interaction.channel as Discord.TextChannel
            await interaction.reply({ content: joke.setup })

            await channel.sendTyping()

            setTimeout(() => {
                interaction.followUp({ content: joke.delivery })
            }, 5000)
        }
    }
} as ChatCommand