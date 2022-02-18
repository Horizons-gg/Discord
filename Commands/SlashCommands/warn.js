const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')

const Permission = require('../../lib/permission')


module.exports = async interaction => {

    //? Check Permissions
    if (!await Permission.Check(interaction.user, process.env.permissions.warn)) return interaction.reply({ content: 'You do not have permission to warn members.', ephemeral: true })


    var Violations = await process.db.collection('storage').findOne({ '_id': 'violations' }), Violations = Violations.presets


    //? Prep Warning
    var Member, Reason, Violation, Rating
    interaction.options._hoistedOptions.forEach(option => {
        switch (option.name) {
            case 'user':
                Member = option.member
                break

            case 'reason':
                Reason = option.value
                break

            case 'violation':
                Violation = option.value
                break

            case 'rating':
                Rating = option.value
                break
        }
    })


    //? Check Fields
    if (!Violations[Violation]) return interaction.reply({ content: `Violation Preset does not Exist!`, ephemeral: true })
    if (!Rating) Rating = Violations[Violation].rating


    //? Update Database
    var Warnings = await process.db.collection('warnings')
    var User = await Warnings.findOne({ '_id': Member.id })
    if (!User) await Warnings.insertOne({
        _id: Member.id,
        warnings: [{
            executor: {
                id: interaction.user.id,
                name: interaction.user.tag
            },
            reason: Reason,
            violation: Violations[Violation],
            rating: Rating,
            date: Date.now()
        }],
        timeouts: 0,
        kicks: 0,
        bans: 0
    })
    else await Warnings.updateOne({ '_id': Member.id }, {
        $push: {
            warnings: {
                executor: interaction.user.id,
                reason: Reason,
                violation: Violations[Violation],
                rating: Rating,
                date: Date.now()
            }
        }
    })


    //? Send Warning to User
    Member.send({
        embeds: [{
            title: `Warning Notice`,
            description: `You have been warned by ${interaction.user.tag} for the following reason:\n\`${Reason}\`\n\n**Violation:** ${Violations[Violation].title}\n**Description:** ${Violations[Violation].description}\n**Violation Rating:** ${Rating}\n\nSee all Violations [here](https://www.horizons.gg/violations)`,
            color: '#eb4034',
        }]
    })
        .then(() => Confirmation(true))
        .catch(() => Confirmation(false))


    //? Confirmation Message
    function Confirmation(boolean) {
        if (boolean) return interaction.reply({ content: `Warning has been added to \`${Member.user.tag}\` and the user successfully received direct message!`, ephemeral: true })
        else return interaction.reply({ content: `>>> Warning has been added to \`${Member.user.tag}\` but the user was unable to receive a direct message.`, ephemeral: true }), interaction.channel.send({
            content: `<@${Member.id}>`,
            embeds: [{
                title: `Warning Notice for ${Member.user.tag}`,
                description: `You have been warned by ${interaction.user.tag} for the following reason:\n\`${Reason}\`\n\n**Violation:** ${Violations[Violation].title}\n**Description:** ${Violations[Violation].description}\n**Violation Rating:** ${Rating}\n\nSee all Violations [here](https://www.horizons.gg/violations)`,
                color: '#eb4034',
            }]
        })
    }

}