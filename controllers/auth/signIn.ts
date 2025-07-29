import { defineRoute } from '@/utils/defineRoute.ts'
import { input } from '@/middlewares/input.ts'
import { res } from '@/utils/res.ts'
import { TZSignIn, zSignIn } from './zod.ts'
import { kv } from '@/kv.ts'
import { hashWithSHA256 } from '@/utils/hashWithSHA256.ts'
import { TUser } from '../users/types.ts'
import { jwt } from '@/utils/jwt.ts'

export const signInFn = async (data: TZSignIn) => {
	const result = await kv.get(['users', data.email])

	if (!result.value) {
		return res.error('User not found', 404)
	}

	const user = result.value as TUser
	const password = await hashWithSHA256(data.password)
	if (password !== user.password) {
		return res.error('Invalid password', 401)
	}

	const { token } = await jwt.sign({
		id: user.id,
		name: user.name,
		email: user.email,
	})

	return res.success({
		token,
		user,
	})
}

export const signIn = defineRoute(input(zSignIn), (ctx) => {
	return signInFn(ctx.state.input)
})
