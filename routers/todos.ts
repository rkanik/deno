import { Router } from "oak";
import { getTodos } from "@/controllers/todos/getTodos.ts";
import { postTodo } from "@/controllers/todos/postTodo.ts";
import { deleteTodos } from "@/controllers/todos/deleteTodos.ts";
import { getTodoById } from "@/controllers/todos/getTodoById.ts";
import { deleteTodoById } from "@/controllers/todos/deleteTodoById.ts";
import { updateTodoById } from "@/controllers/todos/updateTodoById.ts";

const router = new Router();

router
  .prefix("/todos")
  .get("/", getTodos)
  .post("/", postTodo)
  .delete("/", deleteTodos)
  .get("/:id", getTodoById)
  .patch("/:id", updateTodoById)
  .delete("/:id", deleteTodoById);

export default router;
