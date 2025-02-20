const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Sign PRO API",
      version: "1.0.0",
      description: "Documentation de l'API E-Sign PRO"
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Serveur local"
      }
    ]
  },
  apis: ["./routes/*.js"] // Indique où Swagger doit chercher les routes
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
