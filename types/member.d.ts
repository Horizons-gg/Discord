//? Dependencies

import type { ObjectId } from "mongodb"



//? Type Definitions

export { }

declare global {

    interface Member {

        _id: ObjectId

        id: string


        optIn: boolean

        activities: {
            name: string
            lastSeen: Date
            logged: Date[]
        }[]

        aliases: {
            tag: string
            date: Date
        }[]

    }

}