const request = require("supertest");
const app = require("../app");

describe("🧪 Tests des routes utilisateurs", () => {
  let testUser = {
    email: "testuser@example.com",
    password: "password123",
  };

  test("🟢 Inscription d'un nouvel utilisateur", async () => {
    const res = await request(app).post("/api/users/register").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
  });

  test("🔴 Tentative de connexion avec mauvais mot de passe", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(401);
  });

  test("🟢 Connexion avec le bon mot de passe", async () => {
    const res = await request(app).post("/api/users/login").send(testUser);
    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined(); // Vérifie que les cookies JWT sont envoyés
  });
});
