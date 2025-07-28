import { Context } from "oak";
import { kv } from "@/kv.ts";

export const deleteUsers = async (ctx: Context) => {
  try {
    const entries = await kv.list({ prefix: ["users"] });
    for await (const entry of entries) {
      await kv.delete(entry.key);
    }
    ctx.response.status = 200;
    ctx.response.body = { message: "Users deleted successfully" };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
};
