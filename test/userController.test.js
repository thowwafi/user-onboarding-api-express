const request = require('supertest');
const { app, setupServer } = require('../index');
const { admin } = require('../firebase');
let server;

// beforeAll(async () => {
//   server = setupServer();
// });
function generateRandomUsername(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomUsername = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomUsername += characters.charAt(randomIndex);
  }

  return randomUsername;
}
afterAll(() => {
    return new Promise((resolve) => {
      setupServer().close(() => {
        resolve();
      });
    });
  });

describe('User API Endpoints', () => {
  const randomUsername = generateRandomUsername(8);
  describe('POST /api/register', () => {
    test('should register a new user', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          profileName: 'John Doe',
          username: randomUsername,
          password: 'secure_password',
        });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'User registered successfully.');

        await admin.firestore().collection('users').doc(response.body.userId).delete();
      
    
    });

  });

  describe('POST /api/login', () => {
    test('should login a user', async () => {

      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'ajohn_dopopope123',
          password: 'secure_password',
        });
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful.');
      expect(response.body).toHaveProperty('accessToken');
    });

  });

  describe('GET /api/profile', () => {
    test('should get user profile', async () => {
      const responseSignIn = await request(app)
        .post('/api/login')
        .send({
          username: 'ajohn_dopopope123',
          password: 'secure_password',
        });

      const accessToken = responseSignIn.body.accessToken
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(200);
    });
  });
  describe('PUT /api/profile', () => {
    test('should update user profile with profile picture', async () => {
      // const profilePicturePath = 'path/to/mock/profile-picture.jpg';
      const responseSignIn = await request(app)
        .post('/api/login')
        .send({
          username: 'ajohn_dopopope123',
          password: 'secure_password',
        });

      const accessToken = responseSignIn.body.accessToken
      const response = await request(app)
        .put('/api/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .field('profileName', 'Updated Name')
        .field('username', 'john_doe')
        // .attach('profilePicture', profilePicturePath);
  
      expect(response.status).toBe(200);
    });
  });
});
