// Simple test script for the Todo API
const BASE_URL = "http://localhost:8000";

async function testAPI() {
  console.log("🧪 Testing Todo API...\n");

  try {
    // Test 1: Health check
    console.log("1. Testing health check...");
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log("✅ Health check:", healthData);

    // Test 2: Get all todos (should be empty initially)
    console.log("\n2. Testing get all todos...");
    const todosResponse = await fetch(`${BASE_URL}/todos`);
    const todos = await todosResponse.json();
    console.log("✅ All todos:", todos);

    // Test 3: Create a todo
    console.log("\n3. Testing create todo...");
    const createResponse = await fetch(`${BASE_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test todo item" }),
    });
    const createdTodo = await createResponse.json();
    console.log("✅ Created todo:", createdTodo);

    const todoId = createdTodo.id;

    // Test 4: Get the created todo
    console.log("\n4. Testing get specific todo...");
    const getTodoResponse = await fetch(`${BASE_URL}/todos/${todoId}`);
    const retrievedTodo = await getTodoResponse.json();
    console.log("✅ Retrieved todo:", retrievedTodo);

    // Test 5: Update the todo
    console.log("\n5. Testing update todo...");
    const updateResponse = await fetch(`${BASE_URL}/todos/${todoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        title: "Updated test todo", 
        completed: true 
      }),
    });
    const updatedTodo = await updateResponse.json();
    console.log("✅ Updated todo:", updatedTodo);

    // Test 6: Get all todos again (should have one item)
    console.log("\n6. Testing get all todos after creation...");
    const todosAfterResponse = await fetch(`${BASE_URL}/todos`);
    const todosAfter = await todosAfterResponse.json();
    console.log("✅ All todos after creation:", todosAfter);

    // Test 7: Delete the todo
    console.log("\n7. Testing delete todo...");
    const deleteResponse = await fetch(`${BASE_URL}/todos/${todoId}`, {
      method: "DELETE",
    });
    console.log("✅ Delete response status:", deleteResponse.status);

    // Test 8: Get all todos after deletion (should be empty)
    console.log("\n8. Testing get all todos after deletion...");
    const todosAfterDeleteResponse = await fetch(`${BASE_URL}/todos`);
    const todosAfterDelete = await todosAfterDeleteResponse.json();
    console.log("✅ All todos after deletion:", todosAfterDelete);

    console.log("\n🎉 All tests completed successfully!");

  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run tests if this file is executed directly
if (import.meta.main) {
  testAPI();
} 