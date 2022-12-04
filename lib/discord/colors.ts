//? Dependencies

import { resolveColor } from 'discord.js'



//? Colors

export const primary = resolveColor('#007bff')
export const secondary = resolveColor('#6c757d')
export const success = resolveColor('#28a745')
export const danger = resolveColor('#dc3545')
export const warning = resolveColor('#ffc107')
export const info = resolveColor('#17a2b8')

export const light = resolveColor('#f8f9fa')
export const dark = resolveColor('#343a40')
export const grey = resolveColor('#6c757d')


export const random = () => resolveColor(`#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`)