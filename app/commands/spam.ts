import Discord, { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js'

export default {
    name: 'spam',
    description: 'Ping member(s) every second for a set duration',
    type: ApplicationCommandType.ChatInput,

    options: [
        {
            name: 'member1',
            description: 'Member to ping',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'member2',
            description: 'Additional member to ping',
            type: ApplicationCommandOptionType.User,
            required: false,
        },
        {
            name: 'member3',
            description: 'Additional member to ping',
            type: ApplicationCommandOptionType.User,
            required: false,
        },
        {
            name: 'member4',
            description: 'Additional member to ping',
            type: ApplicationCommandOptionType.User,
            required: false,
        },
        {
            name: 'seconds',
            description: 'How many seconds to spam (1–60)',
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1,
            max_value: 120,
        },
    ],

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        const member = interaction.member as Discord.GuildMember
        const hasRole = member.roles.cache.some(r => r.name === 'Regular')

        if (!hasRole) {
            return interaction.reply({ content: 'You need the Regular role to use this command.', ephemeral: true })
        }

        const users = [
            interaction.options.getUser('member1'),
            interaction.options.getUser('member2'),
            interaction.options.getUser('member3'),
            interaction.options.getUser('member4'),
        ].filter(Boolean) as Discord.User[]

        const seconds = interaction.options.getInteger('seconds', true)
        const channel = interaction.channel as Discord.TextChannel
        const mention = users.map(u => `<@${u.id}>`).join(' ')

        await interaction.reply({ content: `Spamming ${mention} for ${seconds} second${seconds === 1 ? '' : 's'}.`, ephemeral: true })

        let elapsed = 0
        const interval = setInterval(() => {
            elapsed++
            channel.send(mention)
            if (elapsed >= seconds) clearInterval(interval)
        }, 1000)
    }
} as ChatCommand
