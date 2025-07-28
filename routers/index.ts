import { Router } from "oak";
import todosRouter from "./todos.ts";

const api = new Router();
api
  .prefix("/api/v1")
  .use(todosRouter.routes())
  .use(todosRouter.allowedMethods());

const router = new Router();
router.use(api.routes());
router.use(api.allowedMethods());

export default router;
