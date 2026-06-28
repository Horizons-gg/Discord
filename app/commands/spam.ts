import Discord, { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js'

export default {
    name: 'spam',
    description: 'Ping member(s) a set number of times as fast as possible',
    type: ApplicationCommandType.ChatInput,

    options: [
        {
            name: 'member1',
            description: 'Member to ping',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'count',
            description: 'Number of pings to send (1–500)',
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1,
            max_value: 500,
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

        const count = interaction.options.getInteger('count', true)
        const channel = interaction.channel as Discord.TextChannel
        const mention = users.map(u => `<@${u.id}>`).join(' ')

        await interaction.reply({ content: `Sending ${count} ping${count === 1 ? '' : 's'} to ${mention}.`, ephemeral: true })

        for (let i = 0; i < count; i++) {
            const msg = await channel.send(mention)
            setTimeout(() => msg.delete().catch(() => null), 1000)
        }
    }
} as ChatCommand
