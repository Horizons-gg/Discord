//? Dependencies

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'
import { Guild as GetGuild, User as GetUser } from '@lib/discord'



//? User Cycle

export default async function () {

    let Activities: { name: string, count: number }[] = []


    const Guild = await GetGuild()

    Guild.members.cache.filter(member => !member.user.bot)
        .forEach(async member => {

            if (!member.presence) return
            if (!member.presence.activities.length) return

            member.presence.activities.forEach(activity => {

                const index = Activities.findIndex(a => a.name == activity.name)
                if (index == -1) Activities.push({ name: activity.name, count: 1 })
                else Activities[index].count++

            })

        })


    setTimeout(() => {

        console.table(Activities.sort((a, b) => b.count - a.count))

    }, 1000 * 5)

}