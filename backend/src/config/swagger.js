const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Sign PRO API",
      version: "1.0.0",
      description: "API pour la digitalisation des conventions de stage.",
      termsOfService: "http://example.com/terms",
      contact: {
        name: "Support API",
        url: "http://example.com/contact",
        email: "support@example.com"
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT"
      }
    },
    servers: [
      {
        url: "http://localhost:5050",
        description: "Serveur de développement"
      },
      {
        url: "https://api.example.com",
        description: "Serveur de production"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            email: {
              type: "string",
              example: "test@example.com"
            },
            role: {
              type: "string",
              example: "user"
            }
          }
        },
        Document: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            title: {
              type: "string",
              example: "Convention de stage"
            },
            userId: {
              type: "integer",
              example: 1
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./routes/*.js"] // Chemin vers les fichiers contenant tes annotations Swagger
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
