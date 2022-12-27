//? Dependencies

import type { ObjectId } from "mongodb"



//? Type Definitions

export { }

declare global {

    interface Position {

        _id: ObjectId

        title: string
        weight: number

        roles: string[]

    }

}