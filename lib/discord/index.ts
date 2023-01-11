//? Dependencies

import Config from '@lib/config'

import Discord from 'discord.js'
import * as Events from './events'


import * as Commands from '../../commands'



//! Internal Methods

import Client from './client'
export default Client



//? Handle Methods

import * as Messages from './messages'


export { Messages }



//? Common Methods

import Guild from './common/guild'
import User from './common/user'

import * as Roles from './common/roles'


export { Guild, User, Roles }