import App from 'app'
import Discord, { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js'


export default {
    name: 'quote',
    description: 'Pull a random quote from quotes',
    type: ApplicationCommandType.ChatInput,

    async execute(interaction) {
        interaction.deferReply()

        const quotes: string[] = []

        const quotesChannel = await App.channel('1374191215376863232') as Discord.TextChannel

        let lastMessageId: string | undefined

        while (true) {
            const messages = await quotesChannel.messages.fetch({
                limit: 100,
                before: lastMessageId
            })

            if (messages.size === 0) break

            for (const message of messages.values()) {
                quotes.push(message.content)
            }

            lastMessageId = messages.last()!.id
        }

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
        interaction.editReply(randomQuote)
    }
} as ChatCommand