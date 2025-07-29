import { Context } from 'oak'
import { kv } from '@/kv.ts'
import { Key } from '@/utils/key.ts'
import { defineRoute } from '@/utils/defineRoute.ts'
import { auth } from '@/middlewares/auth.ts'
import { res } from '@/utils/res.ts'
import { TUser } from '../users/types.ts'

export const deleteTodos = defineRoute(auth, async (ctx: Context) => {
	const user: TUser = ctx.state.user
	const entries = kv.list({
		prefix: Key.todos(user.id),
	})
	for await (const entry of entries) {
		await kv.delete(entry.key)
	}
	return res.success({
		message: 'Todos deleted successfully',
	})
})
