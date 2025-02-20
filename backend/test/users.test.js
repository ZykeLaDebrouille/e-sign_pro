const request = require("supertest");
const app = require("../app"); // ✅ Correct si test/ est dans backend/

let authCookie;
let userId;

describe("🧑‍💻 Tests des routes utilisateurs", () => {
  const testUser = { email: "testuser@example.com", password: "password123" };

  test("🟢 Inscription d'un nouvel utilisateur", async () => {
    const res = await request(app).post("/api/users/register").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
    userId = res.body.id;
  });

  test("🔴 Connexion avec un mauvais mot de passe", async () => {
    const res = await request(app).post("/api/users/login").send({ email: testUser.email, password: "wrongpassword" });
    expect(res.statusCode).toBe(401);
  });

  test("🟢 Connexion avec le bon mot de passe", async () => {
    const res = await request(app).post("/api/users/login").send(testUser);
    console.log("Headers après connexion:", res.headers); // 🔍 Voir le JWT
    authCookie = res.headers["set-cookie"];
    expect(res.statusCode).toBe(200);
    expect(authCookie).toBeDefined();
  });

  test("🟢 Accès à une route protégée", async () => {
    const res = await request(app).get("/api/users/protected").set("Cookie", authCookie);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
  });

  test("🟢 Déconnexion", async () => {
    const res = await request(app).post("/api/users/logout").set("Cookie", authCookie);
    expect(res.statusCode).toBe(200);
  });
});
