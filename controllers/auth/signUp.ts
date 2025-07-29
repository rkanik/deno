import { defineRoute } from '@/utils/defineRoute.ts'
import { input } from '@/middlewares/input.ts'
import { res } from '@/utils/res.ts'
import { TZSignUp, zSignUp } from './zod.ts'
import { kv } from '@/kv.ts'
import { jwt } from '@/utils/jwt.ts'
import { hashWithSHA256 } from '@/utils/hashWithSHA256.ts'
import { getId } from '@/utils/getId.ts'
import { TUser } from '@/controllers/users/types.ts'

export const signUpFn = async (data: TZSignUp) => {
	const result = await kv.get(['users', data.email])

	if (result.value) {
		return res.error('User already exists', 400)
	}

	const password = await hashWithSHA256(data.password)
	const user: TUser = {
		id: await getId(),
		name: data.name,
		email: data.email,
		password,
		createdAt: new Date(),
		updatedAt: new Date(),
	}

	await kv.set(['users', user.email], user)
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

export const signUp = defineRoute(input(zSignUp), (ctx) => {
	return signUpFn(ctx.state.input)
})
