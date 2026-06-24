import request from "supertest";
import app from "../app.js";

describe("Rate Limiter Tests", () => {
  it("should block requests after hitting the maximum limit (100)", async () => {
    
    // We make 100 rapid requests
    for (let i = 0; i < 100; i++) {
      await request(app).get("/api/health");
    }

    // The 101st request should be blocked!
    const response = await request(app).get("/api/health");
    
    // 429 means "Too Many Requests"
    expect(response.status).toBe(429);
    // The rate limiter returns a plain text string by default, not a JSON object!
    expect(response.text).toBe("Too many requests from this IP, please try again later.");
  });
});
