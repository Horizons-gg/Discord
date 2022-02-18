const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')


module.exports = async interaction => {


    //? Fetch Violations List
    if (interaction.options._subcommand === 'fetch') {

        var Violations = await process.db.collection('storage').findOne({ '_id': 'violations' })
        if (!Violations) return interaction.reply({ content: 'No Violation Presets Found', ephemeral: true })

        var List = []
        Violations.presets.forEach((violation, position) => List.push(`${position} | **${violation.title}** [${violation.rating}] - \`${violation.description}\``))

        interaction.reply({ content: `>>> **__Violation Presets__**\n\n${List.join('\n')}`, ephemeral: true })

    }


    //? Add Violation
    if (interaction.options._subcommand === 'add') {

        //? Violation Prep
        var Preset = {
            title: null,
            description: null,
            rating: null
        }

        var Position = null


        //? Violation Apply
        interaction.options._hoistedOptions.forEach(option => {
            switch (option.name) {
                case 'title':
                    Preset.title = option.value
                    break

                case 'description':
                    Preset.description = option.value
                    break

                case 'rating':
                    Preset.rating = option.value
                    break

                case 'position':
                    Position = option.value
                    break
            }
        })


        //? Fetch Violation Presets
        var Violations = await process.db.collection('storage').findOne({ '_id': 'violations' })
        if (!Violations) {
            await process.db.collection('storage').insertOne({
                '_id': 'violations',
                'presets': [Preset]
            })
        } else {
            if (Position) Violations.presets.splice(Position, 0, Preset)
            else Violations.presets.push(Preset), Position = Violations.presets.length - 1
            await process.db.collection('storage').updateOne({ '_id': 'violations' }, { $set: { 'presets': Violations.presets } })
        }


        //? Send Confirmation Message
        interaction.reply({ 'content': `Violation Preset \`${Preset.title}\` has been added at position \`${Position || 0}\``, ephemeral: true })
    }


    //? Remove Violation
    if (interaction.options._subcommand === 'remove') {

        var Violations = await process.db.collection('storage').findOne({ '_id': 'violations' })
        if (!Violations) return interaction.reply({ content: 'No Violation Presets Found.', ephemeral: true })
        if (Violations.presets.length - 1 < interaction.options._hoistedOptions[0].value) return interaction.reply({ content: `There is no Violation Preset ID matching \`${interaction.options._hoistedOptions[0].value}\``, ephemeral: true })

        var Selected = Violations.presets[interaction.options._hoistedOptions[0].value]
        Violations.presets.splice(interaction.options._hoistedOptions[0].value, 1)

        await process.db.collection('storage').updateOne({ '_id': 'violations' }, { $set: { 'presets': Violations.presets } })


        //? Send Confirmation Message
        interaction.reply({ 'content': `Violation Preset \`${Selected.title}\` has been removed at position \`${interaction.options._hoistedOptions[0].value}\``, ephemeral: true })
    }

}