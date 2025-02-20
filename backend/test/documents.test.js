const request = require("supertest");
const app = require("../app"); // ✅ Correct si test/ est dans backend/

let authCookie;

describe("📄 Tests des documents", () => {
  beforeAll(async () => {
    const loginRes = await request(app).post("/api/users/login").send({ email: "testuser@example.com", password: "password123" });
    authCookie = loginRes.headers["set-cookie"];
  });

  test("🔴 Récupération d'un document sans authentification", async () => {
    const res = await request(app).get("/api/documents/1");
    expect(res.statusCode).toBe(401);
  });

  test("🟢 Récupération d'un document avec authentification", async () => {
    const res = await request(app).get("/api/documents/1").set("Cookie", authCookie);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
  });

  test("🟢 Sauvegarde d'un document", async () => {
    const res = await request(app).post("/api/documents/save-convention").set("Cookie", authCookie).send({ studentInfo: { name: "John Doe" }, documentId: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  test("🟢 Signature d'un document", async () => {
    const res = await request(app).post("/api/documents/1/sign").set("Cookie", authCookie).send({ userId: 1, role: "student" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });
});
