const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5500',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api',
      },
      onProxyReq: function(proxyReq, req, res) {
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
