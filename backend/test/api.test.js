const request = require("supertest");
const app = require("../app"); // ✅ Correct si test/ est dans backend/


describe("🌍 Tests de base de l'API", () => {
  test("🟢 Vérifier que l'API est en ligne", async () => {
    const res = await request(app).get("/api/hello");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello from /API/HELLO Backend!");
  });
});
