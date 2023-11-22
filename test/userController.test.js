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
  // Assuming you have mocked implementations for services
  const mockUserService = require('../src/services/userService');
  const randomUsername = generateRandomUsername(8);
  describe('POST /api/register', () => {
    test('should register a new user', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          profileName: 'John Doe',
        //   profilePicture: 'base64EncodedImageString',
          username: randomUsername,
          password: 'secure_password',
        });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'User registered successfully.');

        await admin.firestore().collection('users').doc(response.body.userId).delete();
      
      
    //   expect(response.body).toHaveProperty('userProfile');
      // Add more specific assertions based on your implementation
    });

    // Add more test cases for validation, error scenarios, etc.
  });

  describe('POST /api/login', () => {
    test('should login a user', async () => {
      // Implement login logic in userService and mock the result
      mockUserService.loginUser = jest.fn(() => 'JWT_access_token');

      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'ajohn_dopopope123',
          password: 'secure_password',
        });
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful.');
      expect(response.body).toHaveProperty('accessToken');
      // Add more specific assertions based on your implementation
    });

    // Add more test cases for validation, error scenarios, etc.
  });

  // Similar tests for other endpoints: GET /api/profile, PUT /api/profile
});
