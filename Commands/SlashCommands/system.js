module.exports = interaction => {

    //? Check if the users request contained a system identifier

    if (interaction.options._hoistedOptions.length === 0) {

        //? User did not provide a valid identifier, return the user a list of valid identifiers
        interaction.reply({
            embeds: [{
                color: '#ff4242',
                description: `Please provide a valid system identifier!`,
                fields: [
                    {
                        name: 'System Identifiers',
                        value: `\`${process.env.systemsArray.join('`\n`')}\``
                    },
                    {
                        name: 'Example',
                        value: `\`/system ${process.env.systemsArray[0]}\``
                    }
                ]
            }],
            ephemeral: true
        })

    } else {

        if (process.env.systemsArray.includes(interaction.options._hoistedOptions[0].value)) {
            
            //? User provided a valid identifier, upload the related system card
            interaction.reply({
                files: [
                    `./cache/systems/${interaction.options._hoistedOptions[0].value}.png`
                ]
            })

        } else {

            //? User provided an invalid identifier, return the user a list of valid identifiers
            interaction.reply({
                embeds: [{
                    color: '#ff4242',
                    description: `Please provide a valid system identifier!`,
                    fields: [
                        {
                            name: 'System Identifiers',
                            value: `\`${process.env.systemsArray.join('`\n`')}\``
                        },
                        {
                            name: 'Example',
                            value: `\`/system ${process.env.systemsArray[0]}\``
                        }
                    ]
                }],
                ephemeral: true
            })

        }

    }

}