import { kv } from '@/kv.ts'

export const getId = async () => {
	const id = await kv.get(['id'])
	if (!id.value) {
		await kv.set(['id'], 1)
		return 1
	}
	const newId = (id.value as number) + 1
	await kv.set(['id'], newId)
	return newId
}
