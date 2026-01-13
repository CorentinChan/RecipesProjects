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

describe('POST /deleteRecipe', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('devrait rejeter la suppression si l\'utilisateur n\'est pas admin', async () => {
        const res = await request(app)
            .post('/deleteRecipe')
            .set('Cookie', ['userRole=user']) // Simple utilisateur
            .send({ recipeID: '123' });

        expect(res.status).toBe(302);
        expect(res.header.location).toBe('/');
        // On vérifie que la DB n'a jamais été interrogée
        expect(mockConnection.query).not.toHaveBeenCalled();
    });

    it('devrait supprimer la recette et toutes ses dépendances si admin', async () => {
        // Simulation de succès pour les deux appels query successifs
        mockConnection.query.mockImplementation((sql, params, cb) => {
            cb(null, { affectedRows: 1 }, []);
        });

        const res = await request(app)
            .post('/deleteRecipe')
            .set('Cookie', ['userRole=admin', 'pseudoID=10']) // Admin connecté
            .send({ recipeID: '123' });

        // 1. Vérification de la redirection finale
        expect(res.status).toBe(302);
        expect(res.header.location).toBe('/account?message=recipeDeleted#ownrecipe');

        // 2. Vérification que le cookie recipeID a été nettoyé
        const cookies = res.header['set-cookie'].join(' ');
        expect(cookies).toContain('recipeID=;');

        // 3. Vérification des appels SQL (il y en a deux dans ton code)
        expect(mockConnection.query).toHaveBeenCalledTimes(2);
        
        // Vérification de la grosse requête de suppression multiple
        expect(mockConnection.query).toHaveBeenLastCalledWith(
            expect.stringContaining('DELETE FROM instructions'),
            expect.arrayContaining(['123']),
            expect.any(Function)
        );
    });
});