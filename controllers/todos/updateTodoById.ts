import { Context } from "oak";
import { z } from "zod";
import { zPostTodo } from "./zod.ts";
import { kv } from "@/kv.ts";
import { TTodo } from "./types.ts";

export const updateTodoById = async (ctx: Context) => {
  try {
    const id = (ctx as any).params.id;
    const body = await ctx.request.body.json();
    const parsed = zPostTodo.omit({ id: true }).safeParse(body);
    if (!parsed.success) {
      ctx.response.status = 422;
      ctx.response.body = {
        error: z.treeifyError(parsed.error),
      };
      return;
    }

    const existingTodo = await kv.get(["todos", id]);
    if (!existingTodo.value) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Todo not found" };
      return;
    }

    const todo = existingTodo.value as TTodo;
    const updatedTodo: TTodo = {
      ...todo,
      ...parsed.data,
    };

    await kv.set(["todos", todo.id], updatedTodo);

    ctx.response.body = updatedTodo;
    ctx.response.status = 200;
    return;
  } catch (error) {
    console.error("Error updating todo:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
};
