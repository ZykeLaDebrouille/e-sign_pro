// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy uniquement les requêtes qui commencent par /api vers le backend sur le port 5050.
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5050',
      changeOrigin: true,
    })
  );
};
