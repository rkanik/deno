import { kv } from '@/kv.ts'
import { res } from '@/utils/res.ts'
import { defineRoute } from '@/utils/defineRoute.ts'

export const getUserByEmail = defineRoute(async (ctx) => {
	// deno-lint-ignore no-explicit-any
	const email = (ctx as any).params.email
	const user = await kv.get(['users', email])
	if (!user.value) {
		return res.error('User not found', 404)
	}
	return res.success({
		user,
	})
})
