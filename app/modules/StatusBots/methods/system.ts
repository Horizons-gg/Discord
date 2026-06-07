import Discord from 'discord.js'
import { Bot } from '../index.ts'



interface SystemData {
    IPv4: string
    Location: { city: string; state: string; country: string }
    Network: {
        latency: number
        stats: Array<{ iface: string; rx_bytes: number; tx_bytes: number; rx_sec: number | null; tx_sec: number | null }>
    }
    CPU: {
        model: { simple: string; advanced: { speed: number; cores: number } }
        temperature: { main: number | null }
        usage: string
    }
    Memory: {
        used: number
        total: number
        information: { swapused: number; swaptotal: number }
    }
    Disk: {
        usage: Array<{ mount: string; total: number; used: number; use: number }>
    }
    OS: { hostname: string; distro: string; arch: string }
    System: { uptime: string }
    Docker: Array<{ name: string; state: string }>
    Connections: { total: number; states: Record<string, number> }
    Processes: Array<{ name: string; cpu: number; mem: number }>
}


function progressBar(value: number, max: number, length = 10): string {
    const filled = Math.min(Math.round((value / max) * length), length)
    return `${'█'.repeat(filled)}${'░'.repeat(length - filled)}`
}

function formatBytes(bytes: number): string {
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`
    return `${(bytes / 1e3).toFixed(1)} KB`
}

function embedColor(cpuPct: number, memPct: number, diskPct: number): number {
    if (cpuPct > 90 || memPct > 90 || diskPct > 95) return Discord.Colors.Red
    if (cpuPct > 70 || memPct > 70 || diskPct > 85) return Discord.Colors.Yellow
    return Discord.Colors.Green
}


export default function initialize(bot: Bot) {

    async function fetchData(): Promise<SystemData | null> {
        return await fetch(`http://${bot.rawAddress}`)
            .then(res => res.json() as Promise<SystemData>)
            .catch(() => null)
    }

    function buildEmbed(data: SystemData | null): Discord.EmbedBuilder {
        if (!data) {
            return new Discord.EmbedBuilder()
                .setTitle(`🖥️ ${bot.name}`)
                .setColor(Discord.Colors.Red)
                .setDescription('⚠️ Connection error — could not reach node API')
                .setTimestamp()
                .setFooter({ text: 'Last updated' })
        }

        const cpuPct = parseFloat(data.CPU.usage)
        const memUsed = data.Memory.used
        const memTotal = data.Memory.total
        const memPct = Math.round((memUsed / memTotal) * 100)

        const rootDisk = data.Disk.usage.find(d => d.mount === '/') ?? data.Disk.usage[0]
        const diskPct = rootDisk?.use ?? 0

        const ethStats = data.Network.stats.find(s => s.iface === 'eth0') ?? data.Network.stats[0]

        const dockerRunning = data.Docker.filter(c => c.state === 'running').length
        const dockerTotal = data.Docker.length

        const swapUsed = formatBytes(data.Memory.information.swapused)
        const swapTotal = formatBytes(data.Memory.information.swaptotal)

        const diskLines = data.Disk.usage.map(d =>
            `${d.mount} [${progressBar(d.use, 100)}] ${Math.round(d.used)}/${Math.round(d.total)}GB (${Math.round(d.use)}%)`
        ).join('\n')

        const topProcesses = data.Processes.slice(0, 5).map(p => {
            const name = p.name.length > 12 ? p.name.slice(0, 11) + '…' : p.name.padEnd(12)
            return `${name}  ${p.cpu.toFixed(2).padStart(5)}%  ${p.mem.toFixed(1).padStart(4)}%`
        }).join('\n')

        return new Discord.EmbedBuilder()
            .setTitle(`🖥️ ${data.OS.hostname} — ${data.OS.distro} ${data.OS.arch}`)
            .setColor(embedColor(cpuPct, memPct, diskPct))
            .addFields(
                // Row 1
                { name: '📍 Location', value: `${data.Location.city}, ${data.Location.state}\n${data.Location.country}`, inline: true },
                { name: '⏱️ Uptime', value: data.System.uptime, inline: true },
                { name: '🌐 Latency', value: `${data.Network.latency}ms`, inline: true },
                // Row 2
                {
                    name: `🔲 CPU — ${Math.round(cpuPct)}%`,
                    value: `\`[${progressBar(cpuPct, 100)}]\`\n${data.CPU.model.simple} × ${data.CPU.model.advanced.cores} @ ${data.CPU.model.advanced.speed}GHz`,
                    inline: true
                },
                { name: '🌡️ Temp', value: data.CPU.temperature.main != null ? `${data.CPU.temperature.main.toFixed(1)}°C` : 'N/A', inline: true },
                {
                    name: '🔗 Connections',
                    value: `${data.Connections.states['ESTABLISHED'] ?? 0} established\n${data.Connections.total} total`,
                    inline: true
                },
                // Row 3
                {
                    name: `🧠 Memory — ${memPct}%`,
                    value: `\`[${progressBar(memUsed, memTotal)}]\` ${memUsed} / ${memTotal} GB`,
                    inline: true
                },
                { name: '💾 Swap', value: `${swapUsed} / ${swapTotal}`, inline: true },
                { name: '🐳 Docker', value: `${dockerRunning} / ${dockerTotal} running`, inline: true },
                // Row 4
                {
                    name: '📡 Traffic',
                    value: ethStats ? `⬇️ ${formatBytes(ethStats.rx_bytes)}\n⬆️ ${formatBytes(ethStats.tx_bytes)}` : 'N/A',
                    inline: true
                },
                { name: '​', value: '​', inline: true },
                { name: '​', value: '​', inline: true },
                // Disks + processes
                { name: '💿 Disks', value: `\`\`\`\n${diskLines}\n\`\`\``, inline: false },
                { name: '📊 Top Processes', value: `\`\`\`\n${topProcesses}\n\`\`\``, inline: false },
            )
            .setTimestamp()
            .setFooter({ text: 'Last updated' })
    }

    function updatePresence(data: SystemData | null, page: number) {
        const content = (): [string, Discord.ActivityType, Discord.PresenceStatusData] => {
            if (!data) return ['Connection Error', Discord.ActivityType.Watching, 'dnd']
            switch (page) {
                default: return ['Initializing...', Discord.ActivityType.Watching, 'idle']
                case 1: return [`${data.Network.latency}ms to ${data.Location.city || 'City'}`, Discord.ActivityType.Watching, 'online']
                case 2: return [`${Math.round(parseFloat(data.CPU.usage))}% CPU Usage`, Discord.ActivityType.Watching, 'online']
                case 3: return [`${data.Memory.used}GB / ${Math.round(data.Memory.total)}GB`, Discord.ActivityType.Watching, 'online']
            }
        }

        const presence = content()
        bot.client.user?.setActivity(presence[0], { type: presence[1] })
        bot.client.user?.setStatus(presence[2])
    }


    let statusMessage: Discord.Message | null = null
    let statusChannel: Discord.TextChannel | null = null

    async function findStatusChannel() {
        for (const [, guild] of bot.client.guilds.cache) {
            const channel = guild.channels.cache.find(
                c => c.name === 'system-info' && c.type === Discord.ChannelType.GuildText
            ) as Discord.TextChannel | undefined

            if (!channel) continue
            statusChannel = channel

            const messages = await channel.messages.fetch({ limit: 50 })
            const existing = messages.find(m => m.author.id === bot.client.user?.id && m.embeds.length > 0)
            if (existing) statusMessage = existing
            break
        }
    }

    async function updateEmbed(data: SystemData | null) {
        if (!statusChannel) return
        const embed = buildEmbed(data)

        if (statusMessage) {
            statusMessage = await statusMessage.edit({ embeds: [embed] }).catch(() => null)
        }

        if (!statusMessage) {
            statusMessage = await statusChannel.send({ embeds: [embed] }).catch(() => null)
        }
    }


    let page = 1
    bot.client.user?.setActivity('Initializing...', { type: Discord.ActivityType.Watching })
    bot.client.user?.setStatus('idle')

    findStatusChannel().then(() => {
        setInterval(async () => {
            const data = await fetchData()
            updatePresence(data, page)
            await updateEmbed(data)
            page = page + 1 > 3 ? 1 : page + 1
        }, 1000 * 10)
    })

}
