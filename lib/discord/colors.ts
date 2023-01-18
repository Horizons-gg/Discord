//? Dependencies

import { resolveColor } from 'discord.js'


//? Type

export type Color = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'grey' | 'random'


//? Colors

export const primary = resolveColor('#007bff')    // Blue
export const secondary = resolveColor('#ff6f32')  // Orange
export const success = resolveColor('#28a745')    // Green
export const danger = resolveColor('#dc3545')     // Red
export const warning = resolveColor('#ffc107')    // Yellow
export const info = resolveColor('#17a2b8')       // Cyan

export const light = resolveColor('#f8f9fa')      // White
export const dark = resolveColor('#343a40')       // Black
export const grey = resolveColor('#6c757d')       // Grey


export const random = () => resolveColor(`#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`)