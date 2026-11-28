import { describe, it, expect } from "vitest";
import request from "supertest";

const api = request("http://127.0.0.1:3001");

describe("JobTrack API authentication", () => {

  it("rejects application access without login", async () => {
    const response = await api.get("/api/applications");

    expect(response.status).toBe(401);
  });

  it("rejects creating applications without login", async () => {
    const response = await api
      .post("/api/applications")
      .send({
        company: "Apple",
        position: "Software Engineer",
        status: "Applied",
      });


    expect(response.status).toBe(401);
  });

  it("rejects deletion without login", async () => {
    const response = await api.delete(
      "/api/applications/00000000-0000-4000-8000-000000000001"
    );

    expect(response.status).toBe(401);
  });

  it("rejects checking an account without login", async () => {
    const response = await api.get("/api/auth/me");

    expect(response.status).toBe(401);
  });

  it("rejects registration with a short password", async () => {
    const response = await api
      .post("/api/auth/register")
      .send({
        email: "test@example.com",
        password: "short",
      });

    expect(response.status).toBe(400);
  });

  it("rejects login without credentials", async () => {
    const response = await api
      .post("/api/auth/login")
      .send({});

    expect(response.status).toBe(400);
  });

});
