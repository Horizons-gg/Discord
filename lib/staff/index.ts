//? Dependencies

import { Collection } from '@lib/mongodb'
import { ObjectId } from 'mongodb'

import Discord from 'discord.js'
import { User, Guild } from '@lib/discord'



//? Class Definition

export default class StaffManager implements StaffMember {

    _id: ObjectId

    id: StaffMember['id']
    

    position: StaffMember['position']

    availability: StaffMember['availability']


    
    constructor(id: string) {
        this._id = new ObjectId()

        this.id = id
        
        this.position = null
        this.availability = null
    }



    // set setPosition() {

    // }



}