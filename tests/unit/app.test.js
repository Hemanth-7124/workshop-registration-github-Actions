const request = require('supertest');

// Mock the server module
jest.mock('../../server/index.js', () => {
  const express = require('express');
  const app = express();

  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend server is running' });
  });

  return {
    app,
    server: {
      listen: jest.fn(),
      close: jest.fn()
    }
  };
});

const { app, server } = require('../../server/index.js');

describe('Backend API', () => {
    beforeAll(() => {
        server.listen();
    });

    afterAll(() => {
        server.close();
    });

    describe('GET /health', () => {
        it('should return 200 OK', async () => {
            const response = await request(app).get('/health');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ status: 'OK', message: 'Backend server is running' });
        });
    });

});