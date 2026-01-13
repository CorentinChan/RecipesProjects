const request = require('supertest');
const app = require('../app'); // Assure-toi que le chemin est correct

describe('POST /goRecipe', () => {
    
    it('devrait mettre à jour le cookie recipeID et rediriger vers /recipe', async () => {
        const testRecipeID = '456';

        const res = await request(app)
            .post('/goRecipe')
            .send({ recipeID: testRecipeID });

        // 1. Vérification du code de redirection (302)
        expect(res.status).toBe(302);
        
        // 2. Vérification de la destination de redirection
        expect(res.header.location).toBe('/recipe');

        // 3. Vérification de la présence du nouveau cookie dans les en-têtes
        // res.header['set-cookie'] est un tableau de chaînes
        const cookies = res.header['set-cookie'].join(' ');
        
        expect(cookies).toContain(`recipeID=${testRecipeID}`);
        expect(cookies).toContain('HttpOnly'); // Vérifie l'option httpOnly
    });

    it('devrait fonctionner même si le recipeID est vide', async () => {
        const res = await request(app)
            .post('/goRecipe')
            .send({ recipeID: '' });

        expect(res.status).toBe(302);
        expect(res.header.location).toBe('/recipe');
        
        const cookies = res.header['set-cookie'].join(' ');
        expect(cookies).toContain('recipeID=;'); // Vérifie que le cookie est vidé ou mis à vide
    });
});