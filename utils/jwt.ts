import { SignJWT, jwtVerify } from 'jose'

export const jwt = {
	sign: async (payload: Record<string, unknown>) => {
		console.log(Deno.env.get('JWT_SECRET'))
		try {
			return {
				token: await new SignJWT(payload)
					.setProtectedHeader({ alg: 'HS256' })
					.setExpirationTime('1h')
					.sign(new TextEncoder().encode(Deno.env.get('JWT_SECRET') || '')),
			}
		} catch (error) {
			return { error }
		}
	},
	verify: async (token: string) => {
		try {
			const res = await jwtVerify(token, new TextEncoder().encode(Deno.env.get('JWT_SECRET') || ''))
			return { data: res.payload }
		} catch (error) {
			return { error }
		}
	},
}
