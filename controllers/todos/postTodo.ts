import { Context } from 'oak'
import { kv } from '@/kv.ts'
import { TTodo } from './types.ts'
import { zPostTodo } from './zod.ts'
import { defineRoute } from '@/utils/defineRoute.ts'
import { auth } from '@/middlewares/auth.ts'
import { input } from '@/middlewares/input.ts'
import { res } from '@/utils/res.ts'
import { getId } from '@/utils/getId.ts'
import { Key } from '@/utils/key.ts'

export const postTodo = defineRoute(auth, input(zPostTodo), async (ctx: Context) => {
	const user = ctx.state.user
	const input = ctx.state.input
	if (input.id) {
		const key = Key.todo(user.id, input.id)
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
	}

	const now = new Date()
	const todo: TTodo = {
		id: await getId(),
		title: input.title,
		description: input.description,
		completed: input.completed ?? false,
		createdAt: now,
		updatedAt: now,
	}

	const key = Key.todo(user.id, todo.id)
	await kv.set(key, todo)
	return res.success(todo)
})
