import { z } from 'zod'
import { zEmail, zName, zPassword } from '@/zod.ts'

export type TZSignIn = z.infer<typeof zSignIn>
export const zSignIn = z.object({
	email: zEmail,
	password: zPassword,
})

export type TZSignUp = z.infer<typeof zSignUp>
export const zSignUp = zSignIn.extend({
	name: zName,
})

export type TZAuthenticate = z.infer<typeof zAuthenticate>
export const zAuthenticate = z.union([
	z.object({
		type: z.literal('check'),
		email: zEmail,
	}),
	zSignIn.extend({
		type: z.literal('signIn'),
	}),
	zSignUp.extend({
		type: z.literal('signUp'),
	}),
])
