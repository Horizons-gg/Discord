// External Dependencies
import * as fs from 'fs'
import { Config as Model } from '@models/config'

const Config: Model = JSON.parse(fs.readFileSync('./config.json', 'utf8'))

export default Config