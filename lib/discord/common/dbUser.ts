//? Dependencies

import { ObjectId } from 'mongodb'

import Discord from 'discord.js'

import { Collection } from '@lib/mongodb'



//? Method

export function Fetch(id: string): Promise<Member> {
    return new Promise(async (resolve, reject) => {

        const Users = await Collection('users')
        const User = await Users.findOne({ id: id }) as Member

        // Create New User in Database
        if (!User) {
            const User: Member = {
                _id: new ObjectId(),

                id: id,


                optIn: true,

                activities: [],
                aliases: []
            }

            return Users.insertOne(User)
                .then(() => resolve(User))
                .catch(reject)
        }

        // Return User from Database
        return resolve(User)

    })
}


export function Update(id: string, data: Member): Promise<boolean> {
    return new Promise(async (resolve, reject) => {

        const Users = await Collection('users')
        const User = await Users.findOne({ id: id }) as Member

        
        // Reject if User not found : Update User in DB with data if found
        if (!User) return reject('User could not be found in the Database, no changes made.')
        else await Users.updateOne({ id: id }, { $set: data })
            .then(res => res.acknowledged ? resolve(true) : reject('Database failed to acknowledge update to User, it is likely that no changes have been made'))
            .catch(reject)

    })
}