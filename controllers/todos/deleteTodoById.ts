import { Context } from 'oak'
import { kv } from '@/kv.ts'
import { defineRoute } from '@/utils/defineRoute.ts'
import { auth } from '@/middlewares/auth.ts'
import { res } from '@/utils/res.ts'
import { Key } from '@/utils/key.ts'

export const deleteTodoById = defineRoute(auth, async (ctx: Context) => {
	// deno-lint-ignore no-explicit-any
	const id = (ctx as any).params.id
	if (!id) {
		return res.error('Todo ID is required', 400)
	}

	const key = Key.todo(ctx.state.user.id, id)
	const todo = await kv.get(key)

	if (!todo.value) {
		return res.notFound('Todo not found')
	}

	await kv.delete(key)
	return res.success({
		message: 'Todo deleted successfully',
	})
})
