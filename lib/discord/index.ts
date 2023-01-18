//? Dependencies

import Config from '@lib/config'

import Discord from 'discord.js'
import * as Events from './events'


import * as Commands from '../../commands'



//! Internal Methods

import Client from './client'
export default Client



//? Standards

import * as Colors from './colors'


export { Colors }



//? Handle Methods

import * as Messages from './messages'


export { Messages }



//? Common Methods

import Guild from './common/guild'
import User from './common/user'

import * as Roles from './common/roles'

import * as dbUser from './common/dbUser'


export { Guild, User, Roles, dbUser }