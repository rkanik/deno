import { kv } from '@/kv.ts'
import { TUser } from './types.ts'
import { defineRoute } from '@/utils/defineRoute.ts'
import { auth } from '@/middlewares/auth.ts'
import { Key } from '@/utils/key.ts'
import { res } from '@/utils/res.ts'

export const getUsers = defineRoute(auth, async () => {
	const users: TUser[] = []
	const entries = kv.list({
		prefix: Key.users(),
	})

	for await (const entry of entries) {
		users.push(entry.value as TUser)
	}

	// Sort by creation date (newest first)
	users.sort((a, b) => {
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	})

	return res.success({
		users,
	})
})
