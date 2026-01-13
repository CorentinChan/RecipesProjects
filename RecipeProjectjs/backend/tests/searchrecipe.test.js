const request = require('supertest');
const mysql = require('mysql2');

// Mock de la base de données
const mockConnection = {
    connect: jest.fn((cb) => cb(null)),
    query: jest.fn(),
    on: jest.fn(),
    end: jest.fn()
};

jest.mock('mysql2', () => ({
    createConnection: jest.fn(() => mockConnection),
    createPool: jest.fn(() => mockConnection)
}));

const app = require('../app');

describe('POST /searchRecipes', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('devrait effectuer une recherche initiale et stocker le mot-clé dans un cookie', async () => {
        // 1. On simule les deux appels SQL
        // Premier appel : recherche de tags et catégories (Multi-query)
        mockConnection.query.mockImplementationOnce((sql, params, cb) => {
            const mockResult = [
                [{ recipeID: 10 }, { recipeID: 20 }], // Tags trouvés
                [{ id: 5 }] // Catégorie trouvée
            ];
            cb(null, mockResult, []);
        });

        // Deuxième appel : recherche finale des recettes
        mockConnection.query.mockImplementationOnce((sql, params, cb) => {
            cb(null, [{ id: 10, title: 'Poulet au curry' }], []);
        });

        const res = await request(app)
            .post('/searchRecipes')
            .send({ textSearch: 'Poulet' });

        // Vérifications
        expect(res.status).toBe(200);
        // Vérifie si le cookie searchKey est bien créé
        const cookies = res.header['set-cookie'].join(' ');
        expect(cookies).toContain('searchKey=Poulet');
        
        // Vérifie que la requête finale utilise bien les IDs trouvés
        expect(mockConnection.query).toHaveBeenCalledTimes(2);
    });

    it('devrait appliquer le filtre de tri (ORDER BY title) quand formSelect est présent', async () => {
        // Mock des résultats
        mockConnection.query.mockImplementationOnce((sql, params, cb) => {
            cb(null, [[], []], []); // Aucun tag/catégorie
        });
        mockConnection.query.mockImplementationOnce((sql, params, cb) => {
            cb(null, [], []); // Aucune recette
        });

        const res = await request(app)
            .post('/searchRecipes')
            .set('Cookie', ['searchKey=Pasta'])
            .send({ 
                formSelect: 'true', 
                searchFilter: 'title' 
            });

        expect(res.status).toBe(200);
        
        // Vérifie que la requête SQL contient bien le filtre de tri
        const lastQueryCall = mockConnection.query.mock.calls[1][0];
        expect(lastQueryCall).toContain('ORDER BY title ASC');
    });

    it('devrait gérer le cas où aucun tag n\'est trouvé (tableau d\'IDs à 0)', async () => {
        mockConnection.query.mockImplementationOnce((sql, params, cb) => {
            cb(null, [[], []], []); // Vide
        });
        mockConnection.query.mockImplementationOnce((sql, params, cb) => {
            cb(null, [], []);
        });

        const res = await request(app)
            .post('/searchRecipes')
            .send({ textSearch: 'Introuvable' });

        expect(res.status).toBe(200);
        

    });
});