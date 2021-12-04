const { MessageActionRow, MessageButton } = require('discord.js')

module.exports = async function () {

    if (process.env.guild !== '610606066451087370') return

    var guild = process.client.guilds.cache.get('610606066451087370')
    var channel = await guild.channels.fetch('916103943044599808')

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

        await channel.messages.fetch(messages.bronze).then(async msg => msg.edit(await GenerateEmbed('Bronze Tier - $3.50', guild, '915900106581086268', 'https://www.horizons.gg/assets/images/tiers/300w/bronze.png', 'https://www.patreon.com/join/corehorizons/checkout?rid=8000281')))
        await channel.messages.fetch(messages.silver).then(async msg => msg.edit(await GenerateEmbed('Silver Tier - $7.00', guild, '915901848282615828', 'https://www.horizons.gg/assets/images/tiers/300w/silver.png', 'https://www.patreon.com/join/corehorizons/checkout?rid=4187695')))
        await channel.messages.fetch(messages.gold).then(async msg => msg.edit(await GenerateEmbed('Gold Tier - $10.00', guild, '915902233286152192', 'https://www.horizons.gg/assets/images/tiers/300w/gold.png', 'https://www.patreon.com/join/corehorizons/checkout?rid=8000288')))
        await channel.messages.fetch(messages.platinum).then(async msg => msg.edit(await GenerateEmbed('Platinum Tier - $15.00', guild, '915902594923233290', 'https://www.horizons.gg/assets/images/tiers/300w/platinum.png', 'https://www.patreon.com/join/corehorizons/checkout?rid=8000294')))
        await channel.messages.fetch(messages.emerald).then(async msg => msg.edit(await GenerateEmbed('Emerald Tier - $25.00', guild, '915903015465136138', 'https://www.horizons.gg/assets/images/tiers/300w/emerald.png', 'https://www.patreon.com/join/corehorizons/checkout?rid=8000305')))
        await channel.messages.fetch(messages.ruby).then(async msg => msg.edit(await GenerateEmbed('Ruby Tier - $35.00', guild, '915903561567719495', 'https://www.horizons.gg/assets/images/tiers/300w/ruby.png', 'https://www.patreon.com/join/corehorizons/checkout?rid=8000311')))
        await channel.messages.fetch(messages.diamond).then(async msg => msg.edit(await GenerateEmbed('Diamond Tier - $50.00', guild, '915903859858227200', 'https://www.horizons.gg/assets/images/tiers/300w/diamond.png', 'https://www.patreon.com/join/corehorizons/checkout?rid=8000316')))

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



    process.client.on('guildMemberUpdate', async (oldMember, newMember) => {
        var oldRoles = oldMember._roles
        var newRoles = newMember._roles
        if (oldRoles.length >= newRoles.length) return

        for (role of oldRoles) if (newRoles.includes(role)) newRoles.splice(newRoles.indexOf(role), 1)
        var role = newRoles[0]
        var dynamicRole = await guild.roles.fetch(role)

        var tier, icon, price, head
        if (role === '915900106581086268') tier = 'Bronze', icon = 'https://www.horizons.gg/assets/images/tiers/300w/bronze.png', price = '3.50', head = 'a'
        else if (role === '915901848282615828') tier = 'Silver', icon = 'https://www.horizons.gg/assets/images/tiers/300w/silver.png', price = '7.00', head = 'a'
        else if (role === '915902233286152192') tier = 'Gold', icon = 'https://www.horizons.gg/assets/images/tiers/300w/gold.png', price = '10.00', head = 'a'
        else if (role === '915902594923233290') tier = 'Platinum', icon = 'https://www.horizons.gg/assets/images/tiers/300w/platinum.png', price = '15.00', head = 'a'
        else if (role === '915903015465136138') tier = 'Emerald', icon = 'https://www.horizons.gg/assets/images/tiers/300w/emerald.png', price = '25.00', head = 'an'
        else if (role === '915903561567719495') tier = 'Ruby', icon = 'https://www.horizons.gg/assets/images/tiers/300w/ruby.png', price = '35.00', head = 'a'
        else if (role === '915903859858227200') tier = 'Diamond', icon = 'https://www.horizons.gg/assets/images/tiers/300w/diamond.png', price = '50.00', head = 'a'
        else return


        var channel = await guild.channels.fetch('610976456495071243')
        channel.send({
            content: `Thankyou <@${newMember.user.id}> for Supporting us on Patreon!`,
            embeds: [
                {
                    author: {
                        name: newMember.user.tag,
                        icon_url: newMember.user.avatarURL({ dynamic: true })
                    },
                    title: `${newMember.user.username} has become ${head} ${tier} Tier Patreon!`,
                    description: `Thankyou for becoming ${head} ${tier} Tier Patreon <@${newMember.user.id}>, this supports the community greatly and will help us to keep the servers running!\n\n> Check out <#916103943044599808> to see all our Patreons!`,
                    color: `#${dynamicRole.color.toString('16')}`,
                    thumbnail: {
                        url: icon
                    },
                    footer: {
                        text: `${tier} Tier Patreons donate $${price} every month!`
                    }
                }
            ]
        }).then(msg => msg.react('💖'))

        UpdateList()

    })

}