import { Router } from 'oak'
import { signIn } from '@/controllers/auth/signIn.ts'
import { signUp } from '@/controllers/auth/signUp.ts'
import { authenticate } from '@/controllers/auth/authenticate.ts'

const router = new Router()

router
	.post('/sign-in', signIn)
	.post('/sign-up', signUp)
	.post('/authenticate', authenticate)
	.post('/check', () => {
		//
	})

export default router
