const request = require('supertest');
const mysql = require('mysql2');

// initialize fake mysql connection (mock)
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

describe(' display recipeform with good data', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

   
    // test si la page et le formulaire s'affiche et si la liste des catégories est bien selectionnée de la BDD
    it('GET /recipeform - devrait appeler la DB pour les catégories', async () => {
        mockConnection.query.mockImplementation((sql, cb) => {
            cb(null, [{ id: 1, name: 'Test' }]);
        });

        const res = await request(app).get('/recipeform'); 
        
        expect(res.status).toBe(200); 
        expect(mockConnection.query).toHaveBeenCalled(); // SQL request pour la categorie
    });

    
});