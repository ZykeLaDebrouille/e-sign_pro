const request = require("supertest");
const app = require("../app");

describe("📄 Tests des documents", () => {
  let authToken = "";

  beforeAll(async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "testuser@example.com",
      password: "password123",
    });
    authToken = res.headers["set-cookie"];
  });

  test("🟢 Récupération d'un document (protégé)", async () => {
    const res = await request(app)
      .get("/api/documents/1")
      .set("Cookie", authToken);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
  });

  test("🔴 Accès refusé sans token", async () => {
    const res = await request(app).get("/api/documents/1");
    expect(res.statusCode).toBe(401);
  });
});
