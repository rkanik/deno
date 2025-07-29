import { Context } from 'oak'

type TResponse<Body = object, State = object> =
	| {
			status?: number
			body: Body
	  }
	| {
			state: State
	  }

export type TRoute = (context: Context) => TResponse | Promise<TResponse>

export function defineRoute(...routes: TRoute[]) {
	return async (ctx: Context) => {
		for (const route of routes) {
			try {
				const response = await route(ctx)
				if ('body' in response) {
					ctx.response.status = response.status ?? 200
					ctx.response.body = response.body
					return
				}
				ctx.state = {
					...ctx.state,
					...response.state,
				}
			} catch (error) {
				ctx.response.status = 500
				ctx.response.body = {
					message: error instanceof Error ? error.message : 'Internal Server Error',
				}
				return
			}
		}
		ctx.response.status = 500
		ctx.response.body = {
			message: 'Internal Server Error',
		}
	}
}
