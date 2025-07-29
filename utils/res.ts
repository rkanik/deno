import z from 'zod'

type TError = string | Error

export const res = {
	success<T>(body: T) {
		return {
			status: 200,
			body,
		}
	},
	error(error: TError, status = 500) {
		return {
			status,
			body: typeof error === 'string' ? { message: error } : error,
		}
	},
	next<T>(state: T) {
		return {
			state,
		}
	},
	zodError(error: z.ZodError, status = 422) {
		return {
			status,
			body: z.treeifyError(error),
		}
	},
	notFound(message = 'Not Found') {
		return {
			status: 404,
			body: {
				message,
			},
		}
	},
	unprocessable(error: TError) {
		return this.error(error, 422)
	},
	serverError(error: TError) {
		return this.error(error, 500)
	},
	unauthorized(error: TError) {
		return this.error(error, 401)
	},
}
