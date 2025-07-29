import { Router } from 'oak'
import todosRouter from './todos.ts'
import usersRouter from './users.ts'
import authRouter from './auth.ts'

const api = new Router()
api.prefix('/api/v1')
	// todos
	.use(todosRouter.routes())
	.use(todosRouter.allowedMethods())
	// users
	.use(usersRouter.routes())
	.use(usersRouter.allowedMethods())
	// auth
	.use(authRouter.routes())
	.use(authRouter.allowedMethods())

const router = new Router()
router.use(api.routes())
router.use(api.allowedMethods())

export default router
