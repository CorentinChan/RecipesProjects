var http = require('http');
let url = require('url');
const fsp = require('fs').promises;
let express = require("express");
const bcrypt = require('bcryptjs');
let app = express();
let ejs = require('ejs');
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser')
var mysql = require('mysql2');
const axios = require('axios'); // Import Axios

let count = 0;

// Configuration Axios globale pour éviter les blocages
const axiosConfig = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Encoding': 'gzip, deflate, br'
    },
    family: 4, // Force IPv4
    timeout: 10000 // 10 secondes max avant timeout
};

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
require('dotenv').config();


var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
	multipleStatements: true
});

connection.connect(err => {
    if (err) console.error('❌ Erreur de connexion à MySQL :', err.message);
    else console.log('✅ Connecté à la base MySQL !');
});

// Fonction pause (éviter le ban IP)
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// Fonction export
module.exports = async function copyMealDBC(connection){
startScraping();
}
// Lancement du script
//startScraping();

async function startScraping() {
    console.log("🚀 Démarrage du scraping...");
    await copyAllCat();
    console.log("🏁 Scraping terminé !");
}

async function copyAllCat() {
    const url = `https://www.themealdb.com/api/json/v1/1/list.php?c=list`;

    try {
        // Utilisation de la config avec headers
        const response = await axios.get(url, axiosConfig);
        const meals = response.data.meals;

        console.log(`Trouvé ${meals.length} catégories.`);

        // Utilisation de for...of pour gérer l'async correctement
        for (const element of meals) {
            if (element.strCategory) {
                console.log(`📂 Traitement de la catégorie : ${element.strCategory}`);
                await getID(element.strCategory); // On attend que la catégorie soit finie avant de passer à la suivante
            }
        }

    } catch (error) {
        console.error("Erreur copyAllCat:", error.message);
    }
}

async function getID(cat) {
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`;

    try {
        //  Utilisation de la variable 'url' et non l'URL en dur
        const response = await axios.get(url, axiosConfig); 
        const recipes = response.data.meals;

        if (!recipes) return;

        // Récupération de l'ID de la catégorie en Base de Données
        const getCatIdPromise = () => {
            return new Promise((resolve, reject) => {
                connection.query('SELECT id FROM category WHERE name = ?', [cat], (error, result) => {
                    if (error) reject(error);
                    else resolve(result.length > 0 ? result[0].id : null);
                });
            });
        };

        const categoryID = await getCatIdPromise();

        if (categoryID) {
            // Parcours des recettes de la catégorie
            for (const element of recipes) {
                await copyMealByID(element.idMeal, categoryID);
                count++;
                console.log(`Recette #${count} (ID: ${element.idMeal}) traitée.`);
                
                // PAUSE  longue : 200ms entre chaque recette pour ne pas crash le serveur
                await wait(200); 
            }
        }

    } catch (error) {
        console.error(`Erreur getID pour ${cat}:`, error.message);
    }
}

async function copyMealByID(mealID, categoryID) {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`;

    try {
        //  Ajout de axiosConfig ici aussi
        const response = await axios.get(url, axiosConfig);
        
        if (!response.data.meals) return;
        
        const recipe = response.data.meals[0];

        let post = {
            title: recipe.strMeal,
            image: recipe.strMealThumb,
            description: recipe.strYoutube || "", // Évite null
            auteur: "Meal DB",
            categoryID: categoryID,
        };

        // prepare data ingredients
        let ingredient = [];
        let measure = [];
        for (let i = 1; i <= 20; i++) {
            const ing = recipe[`strIngredient${i}`];
            const mes = recipe[`strMeasure${i}`];
            if (ing && ing.trim() !== "") {
                ingredient.push(ing);
                measure.push(mes);
            }
        }
        
        let tags = [recipe.strArea, recipe.strCategory].filter(t => t); // Nettoie les tags vides

        // Vérification doublon avant insertion
        connection.query('SELECT id FROM recipe WHERE title=? AND categoryID=?', [post.title, post.categoryID],
            function (error, resultCheck) {
                if (error) { console.error(error); return; }

                if (resultCheck.length === 0) {
                    
                    // Nettoyage instructions
                    let cleanInstructions = "";
                    if(recipe.strInstructions) {
                        cleanInstructions = recipe.strInstructions
                            .replace(/\r?\n\r?\n/g, "\n")
                            .trim();
                    }
                    
                    const steps = cleanInstructions
                        .split(/\r?\n+/)
                        .map(s => s.trim())
                        .filter(s => s);

                    // Insertion Recette
                    connection.query('INSERT INTO recipe SET ?', post, function (error, results) {
                        if (error) { console.error("Erreur insert recipe:", error); return; }
                        
                        const recipeID = results.insertId;

                        // Insertion Steps
                        if (steps.length > 0) {
                            const stepValues = steps.map(txt => [txt, recipeID]);
                            connection.query('INSERT INTO instructions (instruction, recipeID) VALUES ?', [stepValues], (err) => { if (err) console.error(err); });
                        }

                        // Insertion Ingrédients
                        if (ingredient.length > 0) {
                            const ingValues = ingredient.map((ingText, idx) => [ingText, measure[idx] || "", recipeID]);
                            connection.query('INSERT INTO liste_ingredients (ingredient, measure, recipeID) VALUES ?', [ingValues], (err) => { if (err) console.error(err); });
                        }

                        // Insertion Tags
                        if (tags.length > 0) {
                            const tagValues = tags.map(txt => [txt, recipeID]);
                            connection.query('INSERT INTO tagslist (tag, recipeID) VALUES ?', [tagValues], (err) => { if (err) console.error(err); });
                        }
                    });
                } else {
                    console.log(`⚠️ Recette déjà existante : ${post.title}`);
                }
            });

    } catch (error) {
        console.error(`Erreur copyMealByID (${mealID}):`, error.message);
    }
}