//? Type Dependencies

import type { ObjectId } from "mongodb"
import type Discord from "discord.js"



//? Type Definitions

export { }

declare global {

    interface Ticket {
        _id: ObjectId

        state: 'open' | 'closed'
        
        owner: Discord.GuildMember | undefined
        channel: Discord.TextBasedChannel | undefined

        details: {
            title: string | undefined
            service: string | undefined
            description: string | undefined
        }

        log: {
            users: {
                id: string
                username: string
                discriminator: string
                avatar: string
            }[]

            messages: {
                id: string
                content: string
                author: string
                timestamp: Date
            }[]
        }

        created: Date
        closed: Date | null
    }

}