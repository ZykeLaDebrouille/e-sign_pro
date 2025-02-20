const request = require("supertest");
const app = require("../app");

let server;
process.env.DB_FILE = ":memory:"; // Utilise une base SQLite en mémoire pour les tests

beforeAll(() => {
  server = app.listen(4000, () => console.log("🧪 Test server running on port 4000"));
});

afterAll((done) => {
  server.close(() => {
    console.log("🛑 Test server stopped");
    done();
  });
});
