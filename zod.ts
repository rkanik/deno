import { z } from 'zod'

export const zName = z.string().min(3, 'Name is required!')
export const zEmail = z.email('Please enter a valid email address')
export const zPassword = z.string().min(8, 'Password must be at least 8 characters long')
