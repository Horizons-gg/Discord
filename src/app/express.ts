import Config from '@lib/config'

import * as express from 'express'
import * as cors from 'cors'


export const app = express()


export function connect() {
    app.listen(Config.port, () => console.log(`API Listening on port ${Config.port}`))

    app.use(cors())

    app.set('view engine', 'ejs')
    app.set('trust proxy', 'loopback')

    app.use('/', express.static('public'))
}