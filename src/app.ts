//!
//! Initialize App
//!

import { connect as ConnectMongo } from '@app/mongo'
import { connect as ConnectExpress } from '@app/express'
import { connect as ConnectDiscord } from '@app/discord'

ConnectMongo()
    .then(() => {
        ConnectExpress()
        ConnectDiscord()
    })
    .catch(error => { throw error })