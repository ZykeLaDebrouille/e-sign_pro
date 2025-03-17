const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://backend:5500', // URL du service backend dans Docker
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api', // Conserve le préfixe /api
      },
      onProxyReq: function(proxyReq, req, res) {
        // Conserver l'en-tête Origin
        if (req.headers.origin) {
          proxyReq.setHeader('Origin', req.headers.origin);
        }
      },
      onError: function(err, req, res) {
        console.error('Erreur de proxy:', err);
        res.status(500).send('Erreur de proxy');
      }
    })
  );
};
