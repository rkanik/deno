import { Context } from "oak";
import { kv } from "@/kv.ts";

export const deleteTodos = async (ctx: Context) => {
  try {
    const entries = await kv.list({ prefix: ["todos"] });
    for await (const entry of entries) {
      await kv.delete(entry.key);
    }
    ctx.response.status = 204;
    return;
  } catch (error) {
    console.error("Error deleting todos:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
};
