import { Context } from 'oak'
import { TTodo } from './types.ts'
import { kv } from '@/kv.ts'
import { defineRoute } from '@/utils/defineRoute.ts'
import { res } from '@/utils/res.ts'
import { auth } from '@/middlewares/auth.ts'
import { Key } from '@/utils/key.ts'

export const getTodos = defineRoute(auth, async (ctx: Context) => {
	const data: TTodo[] = []
	const entries = kv.list({
		prefix: Key.todos(ctx.state.user.id),
	})
	for await (const entry of entries) {
		data.push(entry.value as TTodo)
	}
	data.sort((a, b) => {
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	})
	return res.success({ data })
})
