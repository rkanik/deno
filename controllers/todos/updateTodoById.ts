import { Context } from 'oak'
import { z } from 'zod'
import { zPostTodo } from './zod.ts'
import { kv } from '@/kv.ts'
import { TTodo } from './types.ts'
import { defineRoute } from '@/utils/defineRoute.ts'
import { auth } from '@/middlewares/auth.ts'
import { input } from '@/middlewares/input.ts'
import { res } from '@/utils/res.ts'
import { Key } from '@/utils/key.ts'
import { TUser } from '../users/types.ts'

type TZUpdateTodo = z.infer<typeof zUpdateTodo>
const zUpdateTodo = zPostTodo.omit({ id: true })

export const updateTodoById = defineRoute(auth, input(zUpdateTodo), async (ctx: Context) => {
	// deno-lint-ignore no-explicit-any
	const id = (ctx as any).params.id

	const user: TUser = ctx.state.user
	const input: TZUpdateTodo = ctx.state.input

	const key = Key.todo(user.id, id)
	const eTodo = await kv.get(key)
	if (!eTodo.value) {
		return res.error('Todo not found', 404)
	}

	const todo = eTodo.value as TTodo
	const uTodo: TTodo = {
		...todo,
		...input,
		updatedAt: new Date(),
	}

	await kv.set(key, uTodo)
	return res.success(uTodo)
})
