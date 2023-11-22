// jest.config.js
module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__test__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
    setupFilesAfterEnv: [
        "./test/setupTests.js"
    ]
};
  