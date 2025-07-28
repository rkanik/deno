import { Context } from "oak";
import { TZPostUser, zPostUser } from "./zod.ts";
import { z } from "zod";
import { getId } from "@/utils/getId.ts";
import { kv } from "@/kv.ts";
import { hash } from "bcrypt";
import { TUser } from "./types.ts";

export const postUser = async (ctx: Context) => {
  const body = await ctx.request.body.json();
  const parsed = zPostUser.safeParse(body);
  if (!parsed.success) {
    ctx.response.status = 422;
    ctx.response.body = z.treeifyError(parsed.error);
    return;
  }

  const id = await getId();
  const data = parsed.data as TZPostUser;
  const password = await hash(data.password);

  const user: TUser = {
    id,
    ...data,
    password,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await kv.set(["users", id], user);

  ctx.response.status = 201;
  ctx.response.body = {
    message: "User created successfully",
    user,
  };
};
