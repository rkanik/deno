# Todo API with Deno KV

A simple REST API for managing todos built with Deno, Oak framework, and Deno KV storage.

## Features

- ✅ Full CRUD operations for todos
- 🚀 Built with Deno and Oak framework
- 💾 Persistent storage with Deno KV
- 🔒 Type-safe with TypeScript
- 🌐 CORS enabled for frontend integration
- 📝 Comprehensive error handling

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information and documentation |
| GET | `/health` | Health check endpoint |
| GET | `/todos` | Get all todos |
| GET | `/todos/:id` | Get a specific todo |
| POST | `/todos` | Create a new todo |
| PUT | `/todos/:id` | Update a todo |
| DELETE | `/todos/:id` | Delete a specific todo |
| DELETE | `/todos` | Delete all todos |

## Todo Schema

```typescript
interface Todo {
  id: string;           // Auto-generated UUID
  title: string;        // Todo title (required)
  completed: boolean;   // Completion status
  createdAt: Date;      // Creation timestamp
  updatedAt: Date;      // Last update timestamp
}
```

## Request Examples

### Create a Todo
```bash
curl -X POST http://localhost:8000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries"}'
```

### Get All Todos
```bash
curl http://localhost:8000/todos
```

### Update a Todo
```bash
curl -X PUT http://localhost:8000/todos/{id} \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries and milk", "completed": true}'
```

### Delete a Todo
```bash
curl -X DELETE http://localhost:8000/todos/{id}
```

## Local Development

### Prerequisites
- [Deno](https://deno.land/) installed (version 1.40+)

### Running Locally

1. **Development mode (with auto-reload):**
   ```bash
   deno task dev
   ```

2. **Production mode:**
   ```bash
   deno task start
   ```

The server will start on `http://localhost:8000`

## Deployment to Deno Deploy

### Prerequisites
- Deno Deploy account
- Deno CLI with deploy access

### Deploy Steps

1. **Login to Deno Deploy:**
   ```bash
   deno deploy login
   ```

2. **Deploy the application:**
   ```bash
   deno deploy
   ```

3. **Set up KV Database:**
   - Go to your Deno Deploy dashboard
   - Navigate to your project
   - Go to the "KV" tab
   - Create a new KV database named `todos-db`
   - Link it to your project

### Important Notes for Deno Deploy

- The `deno.json` file includes KV configuration for automatic database linking
- Make sure your Deno Deploy project has KV access enabled
- The KV database must be created and linked before the app can use it

## Environment Variables

No environment variables are required for basic functionality. The app uses Deno KV for storage.

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid input data
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

All errors return JSON responses with descriptive messages.

## CORS Support

The API includes CORS middleware configured to allow:
- All origins (`*`)
- Common HTTP methods (GET, POST, PUT, DELETE, OPTIONS)
- Content-Type and Authorization headers

## Health Check

Use the `/health` endpoint to check if the API is running:

```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## License

MIT License 