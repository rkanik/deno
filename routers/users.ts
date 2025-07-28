import { Router } from "oak";

import { getUsers } from "@/controllers/users/getUsers.ts";
import { postUser } from "@/controllers/users/postUser.ts";
import { deleteUsers } from "@/controllers/users/deleteUsers.ts";

const router = new Router();

router
  .prefix("/users")
  .get("/", getUsers)
  .post("/", postUser)
  .delete("/", deleteUsers);

export default router;
