import { Context } from "oak";
import { kv } from "@/kv.ts";
import { TUser } from "./types.ts";

export const getUsers = async (ctx: Context) => {
  const users: TUser[] = [];
  const entries = kv.list({ prefix: ["users"] });

  for await (const entry of entries) {
    users.push(entry.value as TUser);
  }

  // Sort by creation date (newest first)
  users.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  ctx.response.body = users;
};
