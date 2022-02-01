const Patreon = require('../lib/patreon')


module.exports = async (oldMember, newMember) => {

    //? Guild Check
    if (process.env.guild !== '610606066451087370') return


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

    Patreon.UpdateList()
}