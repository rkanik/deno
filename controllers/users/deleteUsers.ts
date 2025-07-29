import { kv } from '@/kv.ts'
import { defineRoute } from '@/utils/defineRoute.ts'
import { auth } from '@/middlewares/auth.ts'
import { res } from '@/utils/res.ts'
import { Key } from '@/utils/key.ts'

export const deleteUsers = defineRoute(auth, async () => {
	const entries = kv.list({
		prefix: Key.users(),
	})
	for await (const entry of entries) {
		await kv.delete(entry.key)
	}
	return res.success({
		message: 'Users deleted successfully',
	})
})
