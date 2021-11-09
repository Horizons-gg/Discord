var prefix = '%'

const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = async function (app, client, mongodb) {

    client.on('messageCreate', async msg => {

        var args = msg.content.toLowerCase().trim().split(' ')

        if (args[0] === prefix + 'server') {

            msg.channel.send({ embeds: [{ "title": "Discord Embed" }] })

            msg.delete()
        }
    })



    /*client.on('messageCreate', async message => {
        if (!client.application?.owner) await client.application?.fetch();

        if (message.content.toLowerCase() === '!deploy') {
            const data = {
                name: 'ping',
                description: 'Replies with Pong!',
            };

            const command = await client.guilds.cache.get('847246917654151168')?.commands.create(data);
            console.log(command);
        }
    });



    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        if (interaction.commandName === 'ping') {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('primary')
                        .setLabel('Primary')
                        .setStyle('PRIMARY'),
                );

            await interaction.reply({ content: 'Pong!', components: [row] });
        }
    });*/

}