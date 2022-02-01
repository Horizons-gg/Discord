module.exports = function () {

    if (process.env.guild !== '610606066451087370') return

    const embeds = {
        server: {
            guild: "610606066451087370",
            channel: "627864852467286027",
            msg: "742912570545012796",
        },

        rules: {
            guild: "610606066451087370",
            channel: "627864852467286027",
            msg: "742912543844073483",
        },
        guidelines: {
            guild: "610606066451087370",
            channel: "627864852467286027",
            msg: "742912555672141966",
        },
        staffRules: {
            guild: "610606066451087370",
            channel: "627864852467286027",
            msg: "742912562194022543",
        }
    }

    async function update() {

        var guild, channel, message;


        const zeroPad = (num, places) => String(num).padStart(places, '0')
        var horizonsAge = [0, 0, 0, 0, 0];

        const oneSecond = 1000;
        const firstDate = new Date(process.client.guilds.cache.get('610606066451087370').createdAt);
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
                name: `Information | ${process.client.guilds.cache.get('610606066451087370').memberCount} Members`,
                icon_url: "https://i.imgur.com/oacCt7u.png",
            },
            title: "__Welcome to Horizons!__",
            url: "https://www.horizons.gg",
            fields: [
                {
                    name: `GAME SERVERS`, value: `Space Engineers: \`103.193.80.40:27016\`
                SCUM: \`51.161.196.162:28402\`
                Squad: \`[AU] Horizons | discord.gg/ThSUBwu\`
                Minecraft: \`horizons.gg\`
                Eco: \`horizons.gg:3000\`
                Astroneer: __103.193.80.40:7777__ | \`Whitelisted\``, inline: false
                },
                { name: `DONATIONS`, value: `PATREON: https://www.patreon.com/corehorizons\nPAYPAL: https://www.horizons.gg/donate`, inline: false },
                { name: `STAFF`, value: `STAFF APPLICATION: https://www.horizons.gg/dashboard`, inline: false },

                { name: `EXTRA`, value: `Established: \`\`13th of August, 2019\`\`\nAge: \`\`${horizonsAge[4]} Years, ${horizonsAge[3]} Days, ${zeroPad(horizonsAge[2], 2)}:${zeroPad(horizonsAge[1], 2)}:${zeroPad(horizonsAge[0], 2)}\`\``, inline: false },
            ],
            color: "#ff672b",
            timestamp: new Date()
        }

        guild = process.client.guilds.cache.get(embeds.server.guild)
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
            description: `**1.** All Discord Terms of Service Apply - https://discordapp.com/terms.
            **2.** No harassment of any kind.
            
            **3.** No spamming.
            
            **4.** Self promotion such as twitch, youtube, ect. is allowed in <#622638115718299679>. However, Discord servers and other communities are to refer to <@&753919914837803068>. This includes within Voice Channels.
            
            **5.** Follow the directions of <@&688869302434398213>.
            
            **6.** NSFW is NOT permitted anywhere in this discord.
            
            **7.** Do not harass, abuse, threaten others, or collect, or attempt to collect, personal information about users or without their consent.
            
            **8.** Political speech must remain civil, Hate speech of any kind is forbidden.
            
            **9.** Avoid contacting <@&753919914837803068>'s unless necessary. Please submit Support Ticket's in <#772794459355349013>.
            
            **10.** Any attempt of circumventing rules to void consequences, your reasons will be ignored. (If you try circumventing this rule, I will personally ban you on the spot)`,
            color: "#bd34eb",
            timestamp: new Date()
        }

        guild = process.client.guilds.cache.get(embeds.rules.guild)
        channel = guild.channels.cache.get(embeds.rules.channel)
        message = await channel.messages.fetch(embeds.rules.msg)

        await message.edit({ embeds: [communityRulesEmbed] })



        //Community Guidelines Panel
        var communityGuidelinesEmbed = {
            author: {
                name: `Rules [2/3]`,
                icon_url: "https://i.imgur.com/oacCt7u.png",
            },
            title: "Community Guidelines",
            description: `**1.** All Discord Community Guidelines Apply - https://discordapp.com/guidelines.
            **2.** Drunk & Disorderly behaviour will __NOT__ be tolerated.`,
            color: "#bd34eb",
            timestamp: new Date()
        }

        guild = process.client.guilds.cache.get(embeds.guidelines.guild)
        channel = guild.channels.cache.get(embeds.guidelines.channel);
        message = await channel.messages.fetch(embeds.guidelines.msg);

        await message.edit({ embeds: [communityGuidelinesEmbed] })



        //Staff Rules Panel
        var staffRulesEmbed = {
            author: {
                name: `Rules [3/3]`,
                icon_url: "https://i.imgur.com/oacCt7u.png",
            },
            title: "Staff Rules",
            description: `**1.** No abuse of perms such as deafen, mute, nickname change, etc. Unless absolutely necessary.
            **2.** Respect everyone. No use of derogatory terms.
            
            **3.** In-game staff are not to spawn grids, delete grids, or use spectator except for server clean up or helping a player due to a in-game issues (Must be Logged on Website)
            
            **4.** Follow the staff chain of command if you have problems or issues. ( <@&685774855903248394> - <@&685774104233771018> - <@&685773522164908103> - <@&685772632292982794> - <@&753919914837803068>)
            
            **5.** All staff suggestions go to <@&753919914837803068>.
            
            **6.** Events must be planned with <@&685772632292982794> or above.
            
            **7.** Staff members are to be mature and patient with the community, showing immediate aggression when something doesn't go to plan is very immature and untrustworthy.`,
            color: "#bd34eb",
            timestamp: new Date()
        }

        guild = process.client.guilds.cache.get(embeds.staffRules.guild)
        channel = guild.channels.cache.get(embeds.staffRules.channel);
        message = await channel.messages.fetch(embeds.staffRules.msg);

        await message.edit({ embeds: [staffRulesEmbed] })
    }
    setInterval(update, 60000), update()
}