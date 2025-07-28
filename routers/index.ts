import { Router } from "oak";
import todosRouter from "./todos.ts";
import usersRouter from "./users.ts";

const api = new Router();
api
  .prefix("/api/v1")
  // todos
  .use(todosRouter.routes())
  .use(todosRouter.allowedMethods())
  // users
  .use(usersRouter.routes())
  .use(usersRouter.allowedMethods());

const router = new Router();
router.use(api.routes());
router.use(api.allowedMethods());

export default router;
