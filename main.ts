/// <reference lib="deno.unstable" />
import { Application, Router, Context } from "oak";

// Types
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateTodoRequest {
  title: string;
}

interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
}

// Initialize Deno KV
const kv = await Deno.openKv();

// Router setup
const router = new Router();

// Helper function to generate UUID
function generateId(): string {
  return crypto.randomUUID();
}

// Helper function to get current timestamp
function getCurrentTime(): Date {
  return new Date();
}

// GET /todos - Get all todos
router.get("/todos", async (ctx: Context) => {
  try {
    const todos: Todo[] = [];
    const entries = kv.list({ prefix: ["todos"] });

    for await (const entry of entries) {
      todos.push(entry.value as Todo);
    }

    // Sort by creation date (newest first)
    todos.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    ctx.response.body = todos;
    ctx.response.status = 200;
  } catch (error) {
    console.error("Error fetching todos:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

// GET /todos/:id - Get a specific todo
router.get("/todos/:id", async (ctx) => {
  try {
    const id = ctx.params?.id;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Todo ID is required" };
      return;
    }

    const todo = await kv.get(["todos", id]);

    if (!todo.value) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Todo not found" };
      return;
    }

    ctx.response.body = todo.value;
    ctx.response.status = 200;
  } catch (error) {
    console.error("Error fetching todo:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

// POST /todos - Create a new todo
router.post("/todos", async (ctx) => {
  try {
    const body = await ctx.request.body.json();

    if (
      !body.title ||
      typeof body.title !== "string" ||
      body.title.trim() === ""
    ) {
      ctx.response.status = 400;
      ctx.response.body = {
        error: "Title is required and must be a non-empty string",
      };
      return;
    }

    const now = getCurrentTime();
    const todo: Todo = {
      id: generateId(),
      title: body.title.trim(),
      completed: false,
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
});

// PUT /todos/:id - Update a todo
router.put("/todos/:id", async (ctx) => {
  try {
    const id = ctx.params.id;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Todo ID is required" };
      return;
    }

    const body = (await ctx.request.body.json()) as UpdateTodoRequest;

    // Validate request body
    if (
      body.title !== undefined &&
      (typeof body.title !== "string" || body.title.trim() === "")
    ) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Title must be a non-empty string" };
      return;
    }

    if (body.completed !== undefined && typeof body.completed !== "boolean") {
      ctx.response.status = 400;
      ctx.response.body = { error: "Completed must be a boolean" };
      return;
    }

    // Get existing todo
    const existingTodo = await kv.get(["todos", id]);

    if (!existingTodo.value) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Todo not found" };
      return;
    }

    const currentTodo = existingTodo.value as Todo;
    const updatedTodo: Todo = {
      ...currentTodo,
      title: body.title !== undefined ? body.title.trim() : currentTodo.title,
      completed:
        body.completed !== undefined ? body.completed : currentTodo.completed,
      updatedAt: getCurrentTime(),
    };

    await kv.set(["todos", id], updatedTodo);

    ctx.response.body = updatedTodo;
    ctx.response.status = 200;
  } catch (error) {
    console.error("Error updating todo:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

// DELETE /todos/:id - Delete a todo
router.delete("/todos/:id", async (ctx) => {
  try {
    const id = ctx.params?.id;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Todo ID is required" };
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
});

// DELETE /todos - Delete all todos
router.delete("/todos", async (ctx) => {
  try {
    const entries = kv.list({ prefix: ["todos"] });

    for await (const entry of entries) {
      await kv.delete(entry.key);
    }

    ctx.response.status = 204;
  } catch (error) {
    console.error("Error deleting all todos:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

// Health check endpoint
router.get("/health", (ctx) => {
  ctx.response.body = { status: "ok", timestamp: new Date().toISOString() };
  ctx.response.status = 200;
});

// Root endpoint
router.get("/", (ctx) => {
  ctx.response.body = {
    message: "Todo API with Deno KV",
    version: "1.0.0",
    endpoints: {
      "GET /": "API information",
      "GET /health": "Health check",
      "GET /todos": "Get all todos",
      "GET /todos/:id": "Get a specific todo",
      "POST /todos": "Create a new todo",
      "PUT /todos/:id": "Update a todo",
      "DELETE /todos/:id": "Delete a todo",
      "DELETE /todos": "Delete all todos",
    },
  };
  ctx.response.status = 200;
});

// Application setup
const app = new Application();

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

// CORS middleware
app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  ctx.response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 200;
    return;
  }

  await next();
});

app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
const port = 8000;
console.log(`🚀 Todo API server running on http://localhost:${port}`);
console.log(`📖 API Documentation available at http://localhost:${port}/`);

await app.listen({ port });
