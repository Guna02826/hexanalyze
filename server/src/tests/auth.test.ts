import request from "supertest"; // Think of this as our fake frontend
import app from "../app.js";     // Our backend app

// "describe" is like a folder that groups related tests together
describe("Authentication Tests", () => {
  
  // "it" represents a single test case
  it("should successfully register a new user", async () => {
    
    // We use supertest to send a fake POST request to our register route
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123"
      });

    // "expect" is where we check if the server gave us what we wanted
    expect(response.status).toBe(201); // 201 means "Created" successfully
    // The backend actually returns the user's name, email, and a token, not a message!
    expect(response.body).toHaveProperty("name", "Test User");
    expect(response.body).toHaveProperty("email", "test@example.com");
    expect(response.body).toHaveProperty("token");
  });

  it("should fail to register if email is already taken", async () => {
    
    // First, register a user to put them in the fake database
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    });

    // Now, try to register someone else with the EXACT SAME EMAIL
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Another User",
        email: "test@example.com", // Uh oh, same email!
        password: "password123"
      });

    // We expect the server to catch this and return a 400 Bad Request error
    expect(response.status).toBe(400);
    // The message actually has a capital E and an exclamation mark
    expect(response.body).toHaveProperty("message", "User already Exists!");
  });

});
