const { MessageActionRow, MessageButton } = require('discord.js')

module.exports = function () {

    const messages = {
        bronze: '916112042077880331',
        silver: '916112062768365628',
        gold: '916112064936808448',
        platinum: '916112067730219049',
        emerald: '916112071727398983',
        ruby: '916112081529479168',
        diamond: '916112084603920386'
    }


    async function UpdateList() {

        var guild = process.client.guilds.cache.get(process.env.guild)
        var channel = await guild.channels.fetch('916103943044599808')

        await channel.messages.fetch(messages.bronze).then(async msg => msg.edit(await GenerateEmbed('Bronze Tier - $3.50', guild, '915900106581086268', 'https://www.horizons.gg/assets/images/tiers/1000w/bronze.png', 'https://www.patreon.com/join/corehorizons/checkout?rid=8000281')))
        await channel.messages.fetch(messages.silver).then(async msg => msg.edit(await GenerateEmbed('Silver Tier - $7.00', guild, '915901848282615828', 'https://www.horizons.gg/assets/images/tiers/1000w/silver.png', 'https://www.patreon.com/join/corehorizons/checkout?rid=4187695')))
        await channel.messages.fetch(messages.gold).then(async msg => msg.edit(await GenerateEmbed('Gold Tier - $10.00', guild, '915902233286152192', 'https://www.horizons.gg/assets/images/tiers/1000w/gold.png', 'https://www.patreon.com/join/corehorizons/checkout?rid=8000288')))
        await channel.messages.fetch(messages.platinum).then(async msg => msg.edit(await GenerateEmbed('Platinum Tier - $15.00', guild, '915902594923233290', 'https://www.horizons.gg/assets/images/tiers/1000w/platinum.png', 'https://www.patreon.com/join/corehorizons/checkout?rid=8000294')))
        await channel.messages.fetch(messages.emerald).then(async msg => msg.edit(await GenerateEmbed('Emerald Tier - $25.00', guild, '915903015465136138', 'https://www.horizons.gg/assets/images/tiers/1000w/emerald.png', 'https://www.patreon.com/join/corehorizons/checkout?rid=8000305')))
        await channel.messages.fetch(messages.ruby).then(async msg => msg.edit(await GenerateEmbed('Ruby Tier - $35.00', guild, '915903561567719495', 'https://www.horizons.gg/assets/images/tiers/1000w/ruby.png', 'https://www.patreon.com/join/corehorizons/checkout?rid=8000311')))
        await channel.messages.fetch(messages.diamond).then(async msg => msg.edit(await GenerateEmbed('Diamond Tier - $50.00', guild, '915903859858227200', 'https://www.horizons.gg/assets/images/tiers/1000w/diamond.png', 'https://www.patreon.com/join/corehorizons/checkout?rid=8000316')))

    } setInterval(UpdateList, 1000 * 60 * 5), UpdateList()



    async function GenerateEmbed(tier, guild, roleid, iconurl, patreon) {

        var role = await guild.roles.fetch(roleid)
        var members = ``

        role.members.map(m => {
            members += `<@${m.user.id}> - \`${m.user.tag}\`\n`
        })

        var row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setLabel(`Buy ${tier}`)
                .setStyle('LINK')
                .setURL(patreon)
            )

        return {
            content: null,
            embeds: [
                {
                    title: tier,
                    description: members,
                    url: patreon,
                    color: `#${role.color.toString('16')}`,
                    thumbnail: {
                        url: iconurl
                    },
                    timestamp: new Date()
                }
            ],
            components: [row]
        }
    }

}