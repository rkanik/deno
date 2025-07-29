import { TZPostUser, zPostUser } from './zod.ts'
import { getId } from '@/utils/getId.ts'
import { kv } from '@/kv.ts'
import { TUser } from './types.ts'
import { hashWithSHA256 } from '@/utils/hashWithSHA256.ts'
import { defineRoute } from '@/utils/defineRoute.ts'
import { input } from '@/middlewares/input.ts'
import { res } from '@/utils/res.ts'

export const postUser = defineRoute(input(zPostUser), async (ctx) => {
	const id = await getId()
	const data = ctx.state.input as TZPostUser
	const password = await hashWithSHA256(data.password)
	const user: TUser = {
		id,
		...data,
		password,
		createdAt: new Date(),
		updatedAt: new Date(),
	}
	await kv.set(['users', id], user)
	return res.success({ user })
})
