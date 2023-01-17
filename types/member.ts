//? Dependencies

import type { ObjectId } from "mongodb"



//? Type Definitions

export { }

declare global {

    interface Member {

        _id: ObjectId

        id: string


        smartRoles: boolean

        activity: {}

    }

}