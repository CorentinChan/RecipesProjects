const request = require('supertest');
const mysql = require('mysql2');

// 1. Simulation de la connexion MySQL
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

const app = require('../app');

describe('Tests des routes de base', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // --- TEST : Route Racine (/) ---
    it('GET / - devrait rediriger vers /home', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(302);
        expect(res.header.location).toBe('home');

    });




    // --- TEST : Route Search ---
    it('GET /search - devrait vider le cookie searchKey et afficher les recettes', async () => {
        const mockRecipes = [{ id: 1, title: 'Tacos' }];
        mockConnection.query.mockImplementation((sql, cb) => cb(null, mockRecipes));

        const res = await request(app).get('/search');

        expect(res.status).toBe(200);
        // Vérifie si le cookie searchKey est bien réinitialisé dans la réponse
        expect(res.headers['set-cookie'][0]).toContain('searchKey=;');
        expect(mockConnection.query).toHaveBeenCalledWith(
            expect.stringContaining('LIMIT 500'),
            expect.any(Function)
        );
    });

    // --- TEST : Route Login ---
    describe('GET /login', () => {
        it('devrait afficher la page login si l\'utilisateur n\'est pas connecté', async () => {
            const res = await request(app).get('/login'); // Sans cookie
            expect(res.status).toBe(200);
            // On vérifie qu'on n'est pas redirigé
            expect(res.header.location).toBeUndefined();
        });

        it('devrait rediriger vers /account si le cookie pseudo existe', async () => {
            const res = await request(app)
                .get('/login')
                .set('Cookie', ['pseudo=UtilisateurConnecte']);
            
            expect(res.status).toBe(302);
            expect(res.header.location).toBe('/account');
        });
    });

    // --- TEST : Route Contact ---
    it('GET /contact - devrait afficher la page contact', async () => {
        const res = await request(app)
            .get('/contact')
            .set('Cookie', ['pseudo=Jean']);

        expect(res.status).toBe(200);
        
    });

    
});