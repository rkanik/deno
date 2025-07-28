import { randomUUID } from "@/utils/randomUUID.ts";
import { Context } from "oak";
import { kv } from "@/kv.ts";
import { TTodo } from "./types.ts";
import { z } from "zod";
import { zPostTodo } from "./zod.ts";

export const postTodo = async (ctx: Context) => {
  try {
    const body = await ctx.request.body.json();
    const parsed = zPostTodo.safeParse(body);
    if (!parsed.success) {
      ctx.response.status = 422;
      ctx.response.body = {
        error: z.treeifyError(parsed.error),
      };
      return;
    }

    if (parsed.data.id) {
      const existingTodo = await kv.get(["todos", parsed.data.id]);
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
    }

    const now = new Date();
    const todo: TTodo = {
      id: randomUUID(),
      title: parsed.data.title,
      description: parsed.data.description,
      completed: parsed.data.completed ?? false,
      createdAt: now,
      updatedAt: now,
    };

    await kv.set(["todos", todo.id], todo);

    ctx.response.body = todo;
    ctx.response.status = 201;
  } catch (error) {
    console.error("Error creating todo:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
};
