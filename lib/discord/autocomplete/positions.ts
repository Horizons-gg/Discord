//? Dependencies

import { Collection } from "@lib/mongodb"

import { Roles } from '@lib/discord'



export default async (search: string) => {

    const Positions = await (await Collection('positions'))
        .find({ $or: [{ _id: { $regex: search, $options: 'i' } }, { title: { $regex: search, $options: 'i' } }] }, { limit: 25 })
        .toArray()
        .catch(() => []) as Position[]


    const Staff = await (await Collection('staff')).find({}, { projection: { _id: 1 } }).toArray()


    return Positions.map(choice => ({ name: `${choice.title} | ${Staff.filter(staff => staff._id == choice._id).length} Users | GUID: ${choice._id}`, value: choice._id.toString() }))

}