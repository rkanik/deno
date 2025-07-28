import { Context } from "oak";
import { kv } from "@/kv.ts";

export const deleteTodoById = async (ctx: Context) => {
  try {
    const id = (ctx as any).params.id;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = {
        error: "Todo ID is required",
      };
      return;
    }

    const todo = await kv.get(["todos", id]);

    if (!todo.value) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Todo not found" };
      return;
    }

    await kv.delete(["todos", id]);

    ctx.response.status = 204;
  } catch (error) {
    console.error("Error deleting todo:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
};
