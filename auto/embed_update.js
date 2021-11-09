const fs = require('fs').promises

module.exports = function (app, client, mongodb) {

    if (process.env.DISCORD_ID !== '610606066451087370') return

    client.on('ready', async () => {

        const embeds = {
            server: {
                guild: "610606066451087370",
                channel: "627864852467286027",
                msg: "742912570545012796",
            },

            sCommunityRules: {
                guild: "610606066451087370",
                channel: "627864852467286027",
                msg: "742912543844073483",
            },
            sCommunityGuidelines: {
                guild: "610606066451087370",
                channel: "627864852467286027",
                msg: "742912555672141966",
            },
            sStaffRules: {
                guild: "610606066451087370",
                channel: "627864852467286027",
                msg: "742912562194022543",
            },

            se: {
                guild: "610606066451087370",
                channel: "619106246196199446",
                msg: "788779042689515530",
            }
        }

        const update = async () => {

            var guild, channel, message;


            const zeroPad = (num, places) => String(num).padStart(places, '0')
            var horizonsAge = [0, 0, 0, 0, 0];

            const oneSecond = 1000;
            const firstDate = new Date(client.guilds.cache.get('610606066451087370').createdAt);
            var secondDate = new Date();

            horizonsAge[0] = Math.round(Math.abs((firstDate - secondDate) / oneSecond));

            while (horizonsAge[0] >= 60) {
                horizonsAge[1] += 1;
                horizonsAge[0] -= 60;
            };

            while (horizonsAge[1] >= 60) {
                horizonsAge[2] += 1;
                horizonsAge[1] -= 60;
            };

            while (horizonsAge[2] >= 24) {
                horizonsAge[3] += 1;
                horizonsAge[2] -= 24;
            };

            while (horizonsAge[3] >= 365) {
                horizonsAge[4] += 1;
                horizonsAge[3] -= 365;
            };



            //Information Panel
            var serverEmbed = {
                author: {
                    name: `Information | ${client.guilds.cache.get('610606066451087370').memberCount} Members`,
                    icon_url: "https://i.imgur.com/oacCt7u.png",
                },
                title: "__Welcome to Horizons!__",
                url: "https://www.horizons.gg",
                fields: [
                    { name: `GAME SERVERS`, value: await (await fs.readFile("database/messages/server/game-servers.txt")).toString(), inline: false },
                    { name: `DONATIONS`, value: await (await fs.readFile("database/messages/server/donations.txt")).toString(), inline: false },
                    { name: `SOCIAL MEDIA`, value: await (await fs.readFile("database/messages/server/social.txt")).toString(), inline: false },
                    { name: `STAFF`, value: await (await fs.readFile("database/messages/server/staff.txt")).toString(), inline: false },

                    { name: `EXTRA`, value: `Established: \`\`13th of August, 2019\`\`\nAge: \`\`${horizonsAge[4]} Years, ${horizonsAge[3]} Days, ${zeroPad(horizonsAge[2], 2)}:${zeroPad(horizonsAge[1], 2)}:${zeroPad(horizonsAge[0], 2)}\`\``, inline: false },
                ],
                color: "#ff672b",
                timestamp: new Date()
            }

            guild = client.guilds.cache.get(embeds.server.guild)
            channel = guild.channels.cache.get(embeds.server.channel);
            message = await channel.messages.fetch(embeds.server.msg);

            await message.edit({ embeds: [serverEmbed] })



            //Community Rules Panel
            var communityRulesEmbed = {
                author: {
                    name: `Rules [1/3]`,
                    icon_url: "https://i.imgur.com/oacCt7u.png",
                },
                title: "Community Rules",
                description: `${await fs.readFile("database/messages/sRules/community.txt")}`,
                color: "#bd34eb",
                timestamp: new Date()
            }

            guild = client.guilds.cache.get(embeds.sCommunityRules.guild)
            channel = guild.channels.cache.get(embeds.sCommunityRules.channel);
            message = await channel.messages.fetch(embeds.sCommunityRules.msg);

            await message.edit({ embeds: [communityRulesEmbed] })



            //Community Guidelines Panel
            var communityGuidelinesEmbed = {
                author: {
                    name: `Rules [2/3]`,
                    icon_url: "https://i.imgur.com/oacCt7u.png",
                },
                title: "Community Guidelines",
                description: `${await fs.readFile("database/messages/sRules/guidelines.txt")}`,
                color: "#bd34eb",
                timestamp: new Date()
            }

            guild = client.guilds.cache.get(embeds.sCommunityGuidelines.guild)
            channel = guild.channels.cache.get(embeds.sCommunityGuidelines.channel);
            message = await channel.messages.fetch(embeds.sCommunityGuidelines.msg);

            await message.edit({ embeds: [communityGuidelinesEmbed] })



            //Staff Rules Panel
            var staffRulesEmbed = {
                author: {
                    name: `Rules [3/3]`,
                    icon_url: "https://i.imgur.com/oacCt7u.png",
                },
                title: "Staff Rules",
                description: `${await fs.readFile("database/messages/sRules/staffRules.txt")}`,
                color: "#bd34eb",
                timestamp: new Date()
            }

            guild = client.guilds.cache.get(embeds.sStaffRules.guild)
            channel = guild.channels.cache.get(embeds.sStaffRules.channel);
            message = await channel.messages.fetch(embeds.sStaffRules.msg);

            await message.edit({ embeds: [staffRulesEmbed] })



            //SE Rules Panel
            /*var seRulesEmbed = {
                author: {
                    name: `SE`,
                    icon_url: "https://i.imgur.com/oacCt7u.png",
                },
                title: "Space Engineers",
                description: `${await fs.readFile("database/messages/se/se1.txt")}`,
                color: "#039dfc",
                timestamp: new Date()
            }

            guild = client.guilds.cache.get(embeds.se.guild)
            channel = guild.channels.cache.get(embeds.se.channel);
            message = await channel.messages.fetch(embeds.se.msg);

            await message.edit({ embeds: [seRulesEmbed] })*/



            return setTimeout(update, 1000 * 600)
        }

        update()

    });

}