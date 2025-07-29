import { defineRoute } from '@/utils/defineRoute.ts'
import { input } from '@/middlewares/input.ts'
import { res } from '@/utils/res.ts'
import { zAuthenticate, TZAuthenticate } from './zod.ts'
import { signInFn } from './signIn.ts'
import { signUpFn } from './signUp.ts'
import { kv } from '@/kv.ts'

export const authenticate = defineRoute(input(zAuthenticate), async (ctx) => {
	const data = ctx.state.input as TZAuthenticate
	if (data.type === 'signIn') return await signInFn(data)
	if (data.type === 'signUp') return await signUpFn(data)
	if (data.type === 'check') {
		const user = await kv.get(['users', data.email])
		if (user.value) {
			return res.success({
				next: 'signIn',
			})
		}
		return res.success({
			next: 'signUp',
		})
	}
	return res.error('Invalid type', 400)
})
