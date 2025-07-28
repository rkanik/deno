/// <reference lib="deno.unstable" />
import { Application } from "oak";
import { cors } from "./middlewares/cors.ts";
import router from "./routers/index.ts";

// Root endpoint
router.get("/", (ctx) => {
  ctx.response.body = { message: "Hello World" };
  ctx.response.status = 200;
});

// Application setup
const app = new Application();

app.use(cors);
app.use(router.routes());
app.use(router.allowedMethods());

// Error handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error("Unhandled error:", err);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

// Start the server
const port = 8000;
console.log(`🚀 Todo API server running on http://localhost:${port}`);
console.log(`📖 API Documentation available at http://localhost:${port}/`);

await app.listen({ port });
