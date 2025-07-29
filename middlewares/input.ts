import { Context } from 'oak'
import { res } from '../utils/res.ts'
import { z } from 'zod'

export const input = <T>(schema: z.ZodSchema<T>) => {
	return async (ctx: Context) => {
		const body = await ctx.request.body.json()
		const result = schema.safeParse(body)
		if (!result.success) {
			return res.zodError(result.error)
		}
		return res.next({
			input: result.data,
		})
	}
}
