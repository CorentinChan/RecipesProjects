const request = require('supertest');
const mysql = require('mysql2');

//initialize fake mysql connection (mock)
const mockConnection = {
    connect: jest.fn((cb) => { if (cb) cb(null); }),
    query: jest.fn(),
    on: jest.fn(),
    end: jest.fn()
};

jest.mock('mysql2', () => ({
    createConnection: jest.fn(() => mockConnection),
    createPool: jest.fn(() => mockConnection)
}));

// IMPORT APP
const app = require('../app'); 

describe('Suite du logout et cookies vides', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /logout - devrait vider les cookies et rediriger', async () => {
        const res = await request(app)
            .post('/logout')
            .set('Referer', 'http://localhost/home'); 

        expect(res.status).toBe(302);
        const cookies = res.header['set-cookie'].join(' ');
        expect(cookies).toContain('pseudo=;'); // cookie vide
    });


});