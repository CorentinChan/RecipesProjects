const request = require('supertest');
const mysql = require('mysql2');

// step 1 to 3 is for simulate and initialize fake mysql connection (mock)
// 1. mysql2 simulation
const mockConnection = {
    connect: jest.fn((cb) => {
        if (cb) cb(null); // Connection simulation
    }),
    query: jest.fn(),
    on: jest.fn(),
    end: jest.fn(),
    execute: jest.fn()
};

// 2.load mysql2 before app.js (can't work without that)
jest.mock('mysql2', () => ({
    createConnection: jest.fn(() => mockConnection),
    createPool: jest.fn(() => mockConnection)
}));

// 3. app can load now
const app = require('../app');

//test name
describe('Tests  posts Admin ban/giverole', () => {

    //reset tests stats
    beforeEach(() => {
        jest.clearAllMocks();
    });


    it('POST /ban - devrait rediriger vers account avec succès', async () => {
        // update success (affectedRows: 1)
        mockConnection.query.mockImplementation((sql, params, callback) => {
            callback(null, { affectedRows: 1 }, []); // simulate affected row :1
        });

        const res = await request(app) //request post ban
            .post('/ban')
            .send({ act: 'ban', pseudo: 'mauvais_user' }); //req.body data

        expect(res.status).toBe(302); //
        expect(res.header.location).toContain('message=ban'); ///url query should return ban
    });

    it('POST /giveAdmin - devrait rediriger vers noPseudo si l\'user n\'existe pas', async () => {
        // update failed (affectedRows: 0)
        mockConnection.query.mockImplementation((sql, params, callback) => {
            callback(null, { affectedRows: 0 }, []); //simulate affected row :0
        });

        const res = await request(app)
            .post('/giveAdmin')
            .send({ act: 'giveAdmin', pseudo: 'inconnu' });

        expect(res.status).toBe(302);
        expect(res.header.location).toContain('message=noPseudo'); // url query return noPseudo because no pseudo found
    });
});