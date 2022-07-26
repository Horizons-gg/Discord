import Config from '@lib/config'
import * as Mongo from 'mongodb'

export const Collections: {
    Users?: Mongo.Collection
    Tickets?: Mongo.Collection
} = {}

export async function connect() {
    const client: Mongo.MongoClient = new Mongo.MongoClient(`mongodb://${Config.mongo.host}`)
    await client.connect()

    const db: Mongo.Db = client.db(Config.mongo.database)


    const Users: Mongo.Collection = db.collection('users')
    const Tickets: Mongo.Collection = db.collection('tickets')
    
    Collections.Users = Users
    Collections.Tickets = Tickets


    console.log(`Successfully connected to database: ${db.databaseName}`)
}