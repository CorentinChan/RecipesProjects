
var http = require('http');
let url = require('url');
const fsp = require('fs').promises;
let express=require("express");
const bcrypt = require('bcryptjs');
let app=express();
let ejs = require('ejs');
const cookieParser = require('cookie-parser');
const path = require('path'); 
const bodyParser = require('body-parser')
var mysql      = require('mysql2'); 
const axios = require('axios');

const axiosConfig = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Encoding': 'gzip, deflate, br'
    },
    family: 4, // Force IPv4
    timeout: 10000 // 10 secondes max avant timeout
};

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

  

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
	multipleStatements: true
});
 
connection.connect(err => {
  if (err) {
    console.error('❌ Erreur de connexion à MySQL :', err.message);
  } else {
    console.log('✅ Connecté à la base MySQL !');
  }
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'frontend'));

 app.use(express.static(path.join(__dirname, '..', 'frontend')));




const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));


let count=0;
let pseudo = "";


copyAllCat(); //copy all category
//getcategory();

//getID("Breakfast"); //copy one cat



async function copyMealByID(mealID,categoryID) {
  
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`;

    try {
    await wait(600); 

    const response = await axios.get(url,axiosConfig);
    console.log(response.data.meals[0]);
    recipe=response.data.meals[0];

       
       let post  = {
        title: recipe.strMeal,
        image:  recipe.strMealThumb,
        description : recipe.strYoutube,
        auteur : "Meal DB",
        categoryID: categoryID,
    }; 
     let tag= [recipe.strArea, recipe.strCategory]

        let fin = false;let ingredient=[];let measure=[];
    for(let i=1; i<20  && fin===false; i++){
     ingredient[i] = recipe[`strIngredient${i}`];
     measure[i] = recipe[`strMeasure${i}`];

    if (ingredient === "") {
          fin = true;
        }
    }

    var query = connection.query('select * FROM recipe where title=? && auteur = ? and image =? ', [post.title,post.auteur,post.image],
       function (error, resultCheck, fields) {
    if (error) throw error;     
    check=false;
        if(resultCheck.length === 0){
            let filtered = ingredient
              .map((ing, index) => ({ ingredient: ing, measure: measure[index] }))
              .filter(item => item.ingredient && item.ingredient.trim() !== ""); // garde seulement si ingredient non vide

            // Puis on sépare à nouveau :
            ingredient = filtered.map(item => item.ingredient);
            measure = filtered.map(item => item.measure);

    
    let cleanInstructions = recipe.strInstructions
  .replace(/\r?\n\r?\n/g, "\n")  // remplace les doubles/triples sauts par un seul
  .trim();

    const step = cleanInstructions
    .split(/\r?\n+/)       // coupe chaque ligne
    .map(step => step.trim()) // nettoie
    .filter(step => step);    // enlève les lignes vides



        if(resultCheck.length === 0){ 
          var query = connection.query('INSERT INTO recipe SET ?', post,
            function (error, results, fields) {
              if (error) throw error;
              const recipeID = results.insertId;  // ← récupère l’ID auto-incrémenté
              console.log('Dernier recipeID inséré =', recipeID);

              const stepPost = step.map(txt => [txt, recipeID]);
              /*  const ing = ingredient.map(txt=> [ txt, recipeID ]);
                const ingPost= measure.map(txt=> [ txt, ing ]);*/
              const ingPost = ingredient.map((ingTexte, index) => {
                const measureTexte = measure[index];      // correspondante
                return [ingTexte, measureTexte, recipeID];
              });
              const tagPost = tag.map(txt => [txt, recipeID]);



              if (stepPost) {
                connection.query('INSERT INTO instructions (instruction, recipeID) VALUES ?', [stepPost], (err2) => {
                  console.log("instructions insert");
                  if (err2) throw err2;
                });
              }
              if (ingPost) {
                connection.query('INSERT INTO liste_ingredients ( ingredient, measure, recipeID) VALUES ?', [ingPost], (err3) => {
                  console.log("ingredients insert");

                  if (err3) throw err3;
                });
              }

              if (tagPost) {
                connection.query('INSERT INTO tagslist (tag, recipeID) VALUES ?', [tagPost], (err4) => {
                  console.log("tag insert");

                  if (err4) throw err4;
                });
              }
            

            });
          }
        }
  });
    console.log(query.sql); // INSERT INTO contact SET `id` = 1, `title` = 'Hello MySQL'



  } catch (error) {
    console.error(error);
  }

}





async function getcategory() {
  const url = `https://www.themealdb.com/api/json/v1/1/list.php?c=list`;

    try {
    const response = await axios.get(url,axiosConfig);

    //console.log(response.data.meals);

    recipe=response.data.meals;
    let category=[];
    
// Récupère les catégories
recipe.forEach(element => {
  if (element.strCategory) {
    category.push(element.strCategory.trim());
  }
});

// Supprime les doublons
category = [...new Set(category)];

// Prépare les valeurs sous forme de tableau de tableaux
const categoryValues = category.map(name => [name]);

console.log("Catégories à insérer :", categoryValues);

if (categoryValues.length > 0) {
  const sql = 'INSERT IGNORE INTO category (name) VALUES ?';
  connection.query(sql, [categoryValues], (err2, result) => {
    if (err2) throw err2;});
   }

  } catch (error) {
    console.error(error);
  }
}


let categoryID;
async function copyAllCat() {
  const url = `https://www.themealdb.com/api/json/v1/1/list.php?c=list`;

    try {
    const response = await axios.get(url,axiosConfig);

    //console.log(response.data.meals);

    recipe=response.data.meals;
    let category=[];


    
// Récupère les catégories
recipe.forEach(element => {
  if (element.strCategory) {
    //console.log(element.strCategory);
   getID(element.strCategory);
  }
});

// Supprime les doublons

  } catch (error) {
    console.error(error);
  }
}



async function getID(cat) {
    
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`;
    console.log(cat);
    
    try {
        await wait(200); 
    const response = await axios.get(url,axiosConfig);
    


    recipe=response.data.meals;

    connection.query('SELECT id FROM category WHERE name = ?',[cat], function (error, result, fields) {
    if (error) throw error;

    console.log('la categorie est '+result[0].id)
    let categoryID=result[0].id;
    
    recipe.forEach(element => {

    //setTimeout(() => copyMealByID(element.idMeal, categoryID), 600);

       copyMealByID(element.idMeal,categoryID);
       count++;
     
        });
  
                });
      console.log("finish " +count + ' recipes')
// Récupère les catégories


// Supprime les doublons

  } catch (error) {
    console.error(error);
  }
    
}

