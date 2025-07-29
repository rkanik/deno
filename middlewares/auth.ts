import { Context } from 'oak'
import { res } from '../utils/res.ts'
import { jwt } from '../utils/jwt.ts'

export const auth = async (ctx: Context) => {
	const authorization = ctx.request.headers.get('Authorization')
	if (!authorization) return res.unauthorized('Unauthorized')
	const token = authorization.replace('Bearer ', '')
	const { error, data } = await jwt.verify(token)
	if (error) return res.unauthorized('Unauthorized')
	return res.next({ user: data })
}
