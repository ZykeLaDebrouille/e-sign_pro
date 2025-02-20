require("dotenv").config();
const db = require("../db");

beforeAll(() => {
  console.log("⚡ Initialisation des tests...");
});

afterAll(() => {
  db.close();
  console.log("✅ Fin des tests !");
});
