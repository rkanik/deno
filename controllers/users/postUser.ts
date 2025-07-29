import { TZPostUser, zPostUser } from './zod.ts'
import { getId } from '@/utils/getId.ts'
import { kv } from '@/kv.ts'
import { TUser } from './types.ts'
import { hashWithSHA256 } from '@/utils/hashWithSHA256.ts'
import { defineRoute } from '@/utils/defineRoute.ts'
import { input } from '@/middlewares/input.ts'
import { res } from '@/utils/res.ts'

export const postUser = defineRoute(input(zPostUser), async (ctx) => {
	const data = ctx.state.input as TZPostUser
	const exists = await kv.get(['users', data.email])
	if (exists.value) {
		return res.error('User already exists', 400)
	}
	const id = await getId()
	const password = await hashWithSHA256(data.password)
	const user: TUser = {
		id,
		...data,
		password,
		createdAt: new Date(),
		updatedAt: new Date(),
	}
	await kv.set(['users', data.email], user)
	return res.success({ user })
})
