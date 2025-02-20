// tests/auth.test.js
describe('Workflow complet d\'authentification', () => {
    let refreshToken;
  
    test('Connexion réussie', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ email: 'test@example.com', password: 'securePassword123!' });
      
      expect(res.statusCode).toBe(200);
      expect(res.headers['set-cookie']).toEqual(
        expect.arrayContaining([
          expect.stringContaining('accessToken='),
          expect.stringContaining('refreshToken=')
        ])
      );
      
      refreshToken = res.headers['set-cookie'][1];
    });
  
    test('Rafraîchissement de token valide', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', refreshToken);
      
      expect(res.statusCode).toBe(200);
      expect(res.headers['set-cookie'][0]).toMatch(/accessToken=/);
    });
  });