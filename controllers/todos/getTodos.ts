import { Context } from "oak";
import { TTodo } from "./types.ts";
import { kv } from "@/kv.ts";

export const getTodos = async (ctx: Context) => {
  try {
    const todos: TTodo[] = [];
    const entries = kv.list({ prefix: ["todos"] });

    for await (const entry of entries) {
      todos.push(entry.value as TTodo);
    }

    // Sort by creation date (newest first)
    todos.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    ctx.response.body = todos;
    ctx.response.status = 200;
  } catch (error) {
    console.error("Error fetching todos:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
};
