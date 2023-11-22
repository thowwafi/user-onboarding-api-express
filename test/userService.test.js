const userService = require('../src/services/userService');
const { admin } = require('../firebase');

describe('userService', () => {

  describe('registerUser', () => {
    test('should register a new user', async () => {
        const userData = {
            profileName: 'John Doe',
            username: 'john_doe123',
        };
        const result = await userService.createUser(userData);
        expect(result).toHaveProperty('id');

        await admin.firestore().collection('users').doc(result.id).delete();
    });

  });

  describe('loginUser', () => {
    test('should login a user', async () => {
      const result = await userService.authenticateUser('john_dopopope123', 'secure_password');
      
      expect(result).toHaveProperty('username');
      expect(result).toHaveProperty('password');
      expect(result).toHaveProperty('profileName');
    });

  });

});
