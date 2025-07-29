import { Context } from 'oak'
import { kv } from '@/kv.ts'
import { defineRoute } from '@/utils/defineRoute.ts'
import { auth } from '@/middlewares/auth.ts'
import { res } from '@/utils/res.ts'
import { Key } from '@/utils/key.ts'

export const getTodoById = defineRoute(auth, async (ctx: Context) => {
	// deno-lint-ignore no-explicit-any
	const id = (ctx as any).params.id
	if (!id) {
		return res.error('Todo ID is required', 400)
	}

	const todo = await kv.get(Key.todo(ctx.state.user.id, id))
	if (!todo.value) {
		return res.error('Todo not found', 404)
	}

	return res.success(todo.value)
})
