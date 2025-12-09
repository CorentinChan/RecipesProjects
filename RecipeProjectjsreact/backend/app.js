
var http = require('http');
let url = require('url');
const fsp = require('fs').promises;
let express = require("express");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
let ejs = require('ejs');
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser')
var mysql = require('mysql2');
const mysql2 = require('mysql2/promise');
const session = require('express-session');
const nodemailer = require('nodemailer');
const passport = require("passport");
require("./passportConfig");
require('dotenv').config();
var cors = require('cors')

let app = express();

app.use(session({
	secret: process.env.DB_SECRET,      // clé pour signer la session (change-la)
	resave: false,              // ne pas sauvegarder si rien n’a changé
	saveUninitialized: true,    // sauvegarder les nouvelles sessions même si vides
	cookie: { maxAge: 3600000 } // durée de vie du cookie en ms (ici 1h)
}));


app.use(passport.initialize());
app.use(passport.session());


app.use(cors({
  origin: "http://localhost:5173", // ton frontend React
  credentials: true                // permet d’envoyer/recevoir les cookies
}));



const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
	waitForConnections: true, // wait for others
	connectionLimit: 10, // pool reuse connection already existed limit 10 
	queueLimit: 0
});


var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
	multipleStatements: true
});



app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


const reactBuildPath = path.join(__dirname, '../frontend/dist');
app.use('/assets', express.static(path.join(reactBuildPath, 'assets')));

// 2. Ensuite, on sert le reste du dossier dist (pour favicon.ico, etc.)
app.use(express.static(reactBuildPath));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(reactBuildPath, 'index.html'));
});



// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, '..', 'frontend'));

// app.use(express.static(path.join(__dirname, '..', 'frontend')));

let pseudo = '';


// app.get('/', (req, res) => {

// 		res.send('bienvenue!');
// });


app.post('/setRecipeID', async (req, res) => {


		const pseudo = req.cookies.pseudo;
		const pseudoID = req.cookies.pseudoID;
		let recipeID;
		if (req.body.recipeID){ 
            recipeID =req.body.recipeID;
			res.cookie('recipeID', recipeID, {
				maxAge: 60 * 60 * 1000, // 1 jour
				httpOnly: true,              // inaccessible en JS client
				secure: false,               // mettre true si HTTPS
				sameSite: 'lax'              // protection CSRF basique
			});        
        
			
		} 
		else if (req.cookies.recipeID){ recipeID = req.cookies.recipeID; //req.session.recipeID = recipeID;   
			}
		 else{
			const [recipeIDres] = await pool.execute('SELECT id FROM recipe ORDER BY RAND() LIMIT 1;');
			 recipeID = recipeIDres[0].id ;

			 //recipeID = "174" ;
			//req.session.recipeID = recipeID;   

			res.cookie('recipeID', recipeID, {
				maxAge: 60 * 60 * 1000, // 1 jour
				httpOnly: true,              // inaccessible en JS client
				secure: false,               // mettre true si HTTPS
				sameSite: 'lax'              // protection CSRF basique
			});



		} 

		 res.json({response : "cookie updated", recipeID : recipeID})

});

app.post('/getRecipeReco', async (req, res) => {


		const pseudo = req.cookies.pseudo;
		const pseudoID = req.cookies.pseudoID;
		let recipeID=req.body.recipeID;
		
	const [recipeReco] = await pool.execute(`SELECT DISTINCT r.*
	FROM recipe r JOIN recipe r0 ON r0.id = ?
	LEFT JOIN tagslist t0 ON t0.recipeID = r0.id
	LEFT JOIN tagslist t  ON t.recipeID = r.id
	WHERE r.id != r0.id AND t.tag = t0.tag ORDER BY rand() LIMIT 8;`, [recipeID]); 
	//select recipe ID with left join and join

		console.log(`${pseudo} : ${pseudoID} (recipeID = ${recipeID})`);

		 res.json({response : "cookie updated", recipeReco : recipeReco})

});




app.post('/recipeDescription', async (req, res) => {
	try {
		// Connect to the database using promises
		//const pool = await connectMysql2();
		recipeID = req.body.recipeID;
		const [recipeResult] = await pool.execute('SELECT * FROM recipe WHERE id = ?', [recipeID]);	
		const [notes] = await pool.execute('SELECT note FROM notes where  recipeID = ?',[recipeID]);
		const [nbRecipes] = await pool.execute('SELECT count(id) as total FROM recipe where  auteur = ?',[recipeResult[0].auteur]);
		
		//  {let notes=[];}
		res.json({recipe : recipeResult,nbNotes:notes.length,nbRecipes:nbRecipes[0].total});
		
	} catch (err) {
		console.error('Erreur MySQL :', err);
		res.status(500).send(err);
	}
});

app.post('/getSteps', async (req, res) => {
	try {
		// Connect to the database using promises
		let recipeID=req.body.recipeID;
		//const pool = await connectMysql2();
		const [steps] = await pool.execute('SELECT * FROM instructions WHERE recipeID = ?', [recipeID]);
		res.json({instructions : steps});

	} catch (err) {
		console.error('Erreur MySQL :', err);
		res.status(500).send('Erreur serveur');
	}
});

app.post('/getIngredients', async (req, res) => {
	try {
		// Connect to the database using promises
				let recipeID=req.body.recipeID;

		//const pool = await connectMysql2();
const [ingredients] = await pool.execute('SELECT * FROM liste_ingredients WHERE recipeID = ?', [recipeID]);
		res.json({ingredients : ingredients});

	} catch (err) {
		console.error('Erreur MySQL :', err);
		res.status(500).send('Erreur serveur');
	}
});


app.post('/getTags', async (req, res) => {
	try {
		// Connect to the database using promises
				let recipeID=req.body.recipeID;

		//const pool = await connectMysql2();
		const [tags] = await pool.execute('SELECT * FROM tagslist WHERE recipeID = ?', [recipeID]);
		res.json({tags : tags});

	} catch (err) {
		console.error('Erreur MySQL :', err);
		res.status(500).send('Erreur serveur');
	}
});

app.post('/getComment', async (req, res) => {
	try {
		console.log(req.body.recipeID);
		const recipeID = req.body.recipeID;
		console.log(recipeID);
		//const pool = await connectMysql2();
		const [comment] = await pool.execute('SELECT commentaires.*,users.pseudo,users.image,users.mail,notes.note FROM commentaires LEFT JOIN notes  ON commentaires.userID = notes.userID AND notes.recipeID = commentaires.recipeID  JOIN users ON commentaires.userID = users.id WHERE commentaires.recipeID = ? ORDER BY commentaires.date DESC ;', [recipeID]);
		console.log('comment'+comment);
		res.json({comment : comment});


	} catch (err) {
		console.error('Erreur MySQL :', err);
		res.status(500).send('Erreur serveur');
	}
});



app.post('/ban', async(req, res) => {
	act = req.body.act;
	console.log(act);
	let sql;
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!regex.test(req.body.pseudo))sql='UPDATE users SET role =? where pseudo= ? ';
	else sql='UPDATE users SET role =? where mail= ? ';

	if(act==="ban")role="ban";
	else role='user';
	try{ 
	const [result] = await pool.execute(sql,[role,req.body.pseudo]);
		console.log(result);
		
		if(result.affectedRows)	res.json({message:"user is now "+role});
		else res.json({message:"user not found "});
	} catch (err) {
		console.error('Erreur MySQL :', err);
		res.status(500).send('Erreur serveur');
	}

});

app.post('/giveAdmin', async(req, res) => {
	act = req.body.act;
	console.log(act);

	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	let sql;
	if (!regex.test(req.body.pseudo))sql='UPDATE users SET role =? where pseudo= ? ';
	else sql='UPDATE users SET role =? where mail= ? ';

	if(act==="giveAdmin")role="admin";
	else role='user';
	try{ 
	const [result] = await pool.execute(sql,[role,req.body.pseudo]);
		console.log(result);
	
	
		if(result.affectedRows)res.json({message:'user is now '+role});
		else res.json({message:'user not found'});
		//res.render('recipeForm', { title: 'Recipe page', user: pseudo, category: result });
	
	}catch (err){
		res.json(err);
	}

});


let recipeModID;
app.post('/getRecipeMod', async(req, res) => {
	try {


		const pseudo = req.cookies.pseudo;
		const pseudoID = req.cookies.pseudoID;
		let recipeID=req.body.recipeID;

		console.log(`${pseudo} : ${pseudoID} (recipeID = ${recipeID})`);
		const [check] = await pool.execute('SELECT * FROM recipe_list WHERE recipeID = ? and userID=? and type="ownrecipe"', [recipeID,pseudoID]);
		if(check.length===0 && req.cookies.userRole !="admin") res.send('No access role');
		const [recipeResult] = await pool.execute('SELECT * FROM recipe WHERE id = ?', [recipeID]);
		const [steps] = await pool.execute('SELECT * FROM instructions WHERE recipeID = ?', [recipeID]);
		const [ingredients] = await pool.execute('SELECT * FROM liste_ingredients WHERE recipeID = ?', [recipeID]);
		const [tags] = await pool.execute('SELECT * FROM tagslist WHERE recipeID = ?', [recipeID]);
		const [comment] = await pool.execute('SELECT commentaires.*,users.pseudo,users.image FROM commentaires JOIN users ON commentaires.userID = users.id WHERE commentaires.recipeID = ? ;', [recipeID]);
		const [notes] = await pool.execute('SELECT * FROM notes WHERE recipeID = ?', [recipeID]);
		const [category] = await pool.execute('SELECT * FROM category');

		const recipe = recipeResult[0];
		let recipesID = [];
		if (tags.length > 0) {
			for (const tagObj of tags) {
				const [recipesIDres] = await pool.execute('SELECT recipeID FROM tagslist WHERE tag = ? && recipeID!=?',
					[tagObj.tag, recipeID]);
				recipesID.push(...recipesIDres.map(r => r.recipeID));
			}
			console.log("recipefromtaf" + recipesID);
		}
			
		res.json( {
			 user: pseudo, recipe: recipe,instructions: steps, 
			ingredients: ingredients, tags: tags, commentaires: comment, notes: notes, 
			message : req.query.message, category : category
		});


	} catch (err) {
		console.error('Erreur MySQL :', err);
		res.status(500).send('Erreur serveur');
	}

});

app.post('/modifyRecipe', (req, res) => {

	if (req.cookies.pseudo) {
	recipeModID=req.body.recipeID;
	var query = connection.query(`DELETE FROM instructions WHERE recipeID= ?;DELETE FROM liste_ingredients WHERE recipeID= ?;
				DELETE FROM tagslist WHERE recipeID= ?;`
			, [recipeModID, recipeModID, recipeModID], function (error, results, fields) {
				if (error) console.log(error);

				console.log("supprimée :", results)

		let post = {
			title: req.body.title,
			description: req.body.description,
			image: req.body.image,
			totalTime: req.body.totalTime,
			yield: req.body.nbPerson,
			activeTime: req.body.activeTime,
			auteur: req.body.author,
			categoryID: req.body.categoryID,
		};
		console.log('step :', req.body.steps);
		console.log('ingredient :', req.body.ingredients);

		var query = connection.query('UPDATE recipe SET ? where id= ?', [post,recipeModID],
			function (error, results, fields) {
				if (error) throw error;
				const recipeID = results.insertId;  // ← récupère l’ID auto-incrémenté
				
			let stepPost;
			if(req.body.steps ){
				let step = req.body.steps.filter(item => item !== null && item !== "");
				 stepPost = step.map(txt => [txt, recipeModID]);
				/*  const ing = ingredient.map(txt=> [ txt, recipeID ]);
					const ingPost= measure.map(txt=> [ txt, ing ]);*/
			}
			console.log('recipeid'+recipeModID)
			console.log("ingredient body"+req.body.ingredients);
			console.log("tag body"+req.body.tags);

		let tag;
		if(req.body.tags && req.body.tags!=0){tag = req.body.tags.filter(item => item !== null && item !== "");
		console.log(tag);}
			console.log("tag body :" + req.body.tags + " ,tag : " + tag)

		// On filtre les deux tableaux en même temps :
		let ingPost;
		if(req.body.ingredients){
		let ingredient = req.body.ingredients;
		let measure = req.body.measures;

		let filtered = ingredient
			.map((ing, index) => ({ ingredient: ing, measure: measure[index] }))
			.filter(item => item.ingredient && item.ingredient.trim() !== ""); // garde seulement si ingredient non vide

		// Puis on sépare à nouveau :
		ingredient = filtered.map(item => item.ingredient);
		measure = filtered.map(item => item.measure);

			 ingPost = ingredient.map((ingTexte, index) => {
					const measureTexte = measure[index];      // correspondante
					return [ingTexte, measureTexte, recipeModID];
				});

		console.log("ingPost" + ingPost);
		console.log(ingredient); console.log(measure);
	}
		console.log(req.body.steps  && req.body.steps.length>0);
				if (req.body.steps!=''  && req.body.steps) {
					connection.query('INSERT INTO instructions (instruction, recipeID) VALUES ?', [stepPost], (err2) => {
						console.log("instructions insert");
						if (err2) throw err2;
					});
				}
				
				if (req.body.ingredients && req.body.ingredients!='') {
					connection.query('INSERT IGNORE INTO liste_ingredients ( ingredient, measure, recipeID) VALUES ?', [ingPost], (err3) => {
						console.log("ingredients insert");

						if (err3) throw err3;
					});
				}
				if(req.body.tags && req.body.tags!=""){const tagPost = tag.map(txt => [txt, recipeModID]);
				 
				connection.query('INSERT IGNORE INTO tagslist (tag, recipeID) VALUES ?', [tagPost], (err4) => {
				console.log("tag insert");

					if (err4) throw err4;
				});
					}
					console.log(req.body.ingredients)
					console.log("fin"); // INSERT INTO contact SET `id` = 1, `title` = 'Hello MySQL'
					res.json({check:true})
					//res.redirect('/account?message=recipeModified#ownrecipe')
					//if(url.pathname==="recipe") res.redirect('/recipe?message=recipeMod')

			});
	});

	}
	else console.log("not connected!");


});


app.get('/search', async(req, res) => {
	pseudo = req.cookies.pseudo;

	try{ 
	const [result] = await pool.execute('SELECT * FROM recipe LIMIT 500 ');
		// Neat!
		console.log(result);
		console.log(fields);

		res.cookie('searchKey', "", {
			maxAge: 60 * 60 * 1000, // 1 jour
			httpOnly: true,              // inaccessible en JS client
			secure: false,               // mettre true si HTTPS
			sameSite: 'lax'              // protection CSRF basique
		});

		res.render('search', { title: 'Recipe page', user: pseudo, recipes: result });

	}catch (err){
		res.json(err);
	}

});

app.get('/login', (req, res) => {
	console.log("login");
	let pseudo=req.cookies.pseudo ?? null;
	if (!pseudo) res.render('login', { user: pseudo, erreur: "" });
	else res.redirect('/account');

});

// app.get('/account', async (req, res) => {
// 	if(!req.cookies.pseudo) res.redirect("/");
// 	else{ 
// 	const pseudo = req.cookies.pseudo;
// 	//if (!pseudo) return res.redirect('/');

// 	const pseudoID = req.cookies.pseudoID;

// 	try {

// 		console.log(pseudoID)

// 		// get recipe ID 
// 		const [favIDResults] = await pool.query('SELECT recipeID FROM recipe_list WHERE userID = ? AND type = "favoris"', [pseudoID]);
// 		const [ownIDResults] = await pool.query('SELECT recipeID FROM recipe_list WHERE userID = ? AND type = "ownRecipe"', [pseudoID]);
// 		// get notes


// 		const recipesIDfav = favIDResults.map(r => r.recipeID);
// 		const recipesIDcreat = ownIDResults.map(r => r.recipeID);

// 		// security for empty values
// 		if (recipesIDfav.length === 0) recipesIDfav.push(null);
// 		if (recipesIDcreat.length === 0) recipesIDcreat.push(null);

// 		// Récupérer les recettes et info utilisateur
// 		const [recipeResults] = await pool.query(`
// 			SELECT * FROM recipe WHERE id IN (?);SELECT * FROM recipe WHERE id IN (?);SELECT * FROM users WHERE id = ?;
// 		`, [recipesIDfav, recipesIDcreat, pseudoID]);

// 		const fav = recipeResults[0];
// 		const created = recipeResults[1];
// 		const userInfo = recipeResults[2][0];
// 		if (!userInfo.image) userInfo.image = "https://picsum.photos/400/250?random=1";


// 		const [notesResults] = await pool.query('SELECT n.*, r.title FROM notes n JOIN recipe r ON n.recipeID = r.id WHERE n.userID = ?;', [pseudoID]);
// 		const notes = notesResults;

// 		const [commentsResults] = await pool.query('SELECT n.*, r.title FROM commentaires n JOIN recipe r ON n.recipeID = r.id WHERE n.userID = ?;', [pseudoID]);
// 		const comments = commentsResults;

// 		// Rendu de la page account
// 		res.render('account', {
// 			title: 'My Account', user: pseudo,userRole:req.cookies.userRole, userInfo: userInfo,
// 			recipes: fav, ownRecipes: created,
// 			notes: notes, commentaires: comments, openDiv : req.query.openDiv, message : req.query.message
// 		});


// 	} catch (err) {
// 		console.error('Erreur MySQL:', err);
// 		res.status(500).send('Erreur serveur');
// 	}

// }

// });

// Route /contact séparée
// app.get('/contact', (req, res) => {
// 	const pseudo = req.cookies.pseudo;
// 	res.render('contact', { user: pseudo, erreur: "", messageCheck: '' });
// });




app.listen(3001, () => {
	console.log(` app listening at http://localhost:3001`);
});




app.post('/signup', (req, res) => {
	
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!regex.test(req.body.mail))  {res.json({succeed: false, message : "mail format incorrect"});}

	var query = connection.query(`SELECT pseudo FROM users where pseudo= ?  `
	,[req.body.pseudo], function (error, results, fields) {
	if (results.length> 0 ) {res.json({succeed: false, message : "pseudo already exists"});}
	else{

	const salt = bcrypt.genSaltSync(10);
	const hashmdp = bcrypt.hashSync(req.body.password, salt);


	let post = {
		pseudo: req.body.pseudo,
		mail: req.body.mail,
		mdp: hashmdp,

	};
	var query = connection.query('INSERT IGNORE INTO users SET ?', post, function (error, results, fields) {
		if (error) throw error;
		// Neat!
	console.log(query.sql); // INSERT INTO contact SET `id` = 1, `title` = 'Hello MySQL'

	if(results.affectedRows===0)
	{message="mailExist";
	res.json( {succeed:false,message:'mail already exist'})}
	else{ 
	let subjectMail= "Your account have been created !"
	let textMail= "Hello " + req.body.pseudo + ", your account have been created you can connect now!"
	sendMail(req.body.mail,subjectMail,textMail);
	let message="accountCreated";
	
		res.cookie('pseudo', req.body.pseudo, {
						maxAge: 3600000,   // expire dans 1h
						httpOnly: true,    // inaccessible côté client (document.cookie)
						secure: false,     // true si HTTPS
						
					});

					res.cookie('pseudoID', results.insertId, {
						maxAge: 3600000,   // expire dans 1h
						httpOnly: true,    // inaccessible côté client (document.cookie)
						secure: false,     // true si HTTPS
					});
						res.cookie('userRole', "user", {
						maxAge: 3600000,   // expire dans 1h
						httpOnly: true,    // inaccessible côté client (document.cookie)
						secure: false,     // true si HTTPS
					});
	res.json( {succeed:true,message:'Account have been created, you can connect now!'});
	}
	});
}	
});	

});

app.post('/logout', (req, res) => {
	res.clearCookie('pseudo');
	res.clearCookie('pseudoID');
	res.clearCookie('userRole');
	console.log('Cookie "pseudo" supprimé ✅');
	res.send({succeed:true})
	//res.redirect(req.get('referer'));
});

app.get('/getPseudo', (req, res) => {
		const pseudo = req.cookies.pseudo||"";
	const pseudoID = req.cookies.pseudoID;
	let test='test';
	res.json({pseudo : pseudo,role : req.cookies.userRole });
	console.log("pseudo cookes :"+req.cookies.pseudo)
})

app.post('/signin', (req, res) => {
	console.log(req.body);
	let mail = req.body.mail;
	let mdp = req.body.password;
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!regex.test(req.body.mail))  {return res.redirect();}

	connection.query('SELECT * FROM users WHERE mail = ?', [mail], function (error, result, fields) {
		if (error) throw error;
		// Neat!

		if (!(result && result.length > 0)) res.json({ succeed : false, message: "Mail doesn't exist" });

			else {
			hash = result[0].mdp;
			console.log(result[0].pseudo + result[0].id);
			let pseudoBDD = result[0].pseudo;
			let pseudoIDBDD = result[0].id;
			let userRole= result[0].role

			bcrypt.compare(mdp, hash, (err, resultCompare) => {
				if (err) {
					// Handle error
					console.error('Error comparing passwords:', err);
					return;
				}

				if (resultCompare) {
					console.log('Passwords match! User authenticated.');
					res.cookie('userRole', userRole, {
						maxAge: 3600000,   // expire dans 1h
						httpOnly: true,    // inaccessible côté client (document.cookie)
						secure: false,     // true si HTTPS
					});

					res.cookie('pseudo', pseudoBDD, {
						maxAge: 3600000,   // expire dans 1h
						httpOnly: true,    // inaccessible côté client (document.cookie)
						secure: false,     // true si HTTPS
					});

					res.cookie('pseudoID', pseudoIDBDD, {
						maxAge: 3600000,   // expire dans 1h
						httpOnly: true,    // inaccessible côté client (document.cookie)
						secure: false,     // true si HTTPS
					});

					//res.redirect('/profil');
					res.json({ succeed : true,pseudo :pseudoBDD, message: "You are connected, redirect in 3s" });
					
				} else {
					// Passwords don't match, authentication failed
					console.log('Passwords do not match! Authentication failed.');
					res.json({ succeed : false, message: "Passwords do not match!" });
				}
			});

		}


		app.get('/profil', (req, res) => {
			// Lire le cookie nommé "pseudo"
			const pseudo = req.cookies.pseudo;

					if (pseudo) {
						console.log(`Bonjour ${pseudo} 👋`);
					} else {
						console.log('Aucun cookie "pseudo" trouvé');
					}

					});
				});
			});

app.get('/getCategory',async(req,res) =>
{	

	try{
		const [category] = await pool.execute('SELECT * FROM category');
		res.json({category:category})
	}
	 catch (err) {
		console.error('Erreur MySQL :', err);
		res.status(500).send('Erreur serveur');
	}
})

app.get('/getProfil',async(req,res) =>
{	

	try{
		let pseudoID=parseInt(req.cookies.pseudoID);
		const [user] = await pool.execute('SELECT * FROM users where id=?',[pseudoID]);
		res.json({user:user[0]})
	}
	 catch (err) {
		console.error('Erreur MySQL :', err);
		res.status(500).send('Erreur serveur');
	}
})

app.get('/getComments',async(req,res) =>
{	

	try{
		let pseudoID=parseInt(req.cookies.pseudoID);
		const [comments] = await pool.execute('SELECT commentaires.*,recipe.title FROM commentaires LEFT JOIN recipe  ON recipe.id = commentaires.recipeID  WHERE commentaires.userID = ? ORDER BY commentaires.date DESC ;', [pseudoID]);
		const [notes] = await pool.execute('SELECT *,recipe.title FROM notes LEFT JOIN recipe  ON recipe.id = notes.recipeID where userID=?',[pseudoID]);

		res.json({comments:comments, notes : notes})
	}
	 catch (err) {
		console.error('Erreur MySQL :', err);
		res.status(500).send('Erreur serveur');
	}
})

app.get('/getOwnRecipes',async(req,res) =>
{	

	try{
		let pseudoID=parseInt(req.cookies.pseudoID);
		const [ownRecipes] = await pool.execute('SELECT type, recipe.* FROM recipe_list JOIN recipe ON recipe_list.recipeID=recipe.id  WHERE userID = ?  && type="ownrecipe";', [pseudoID]);

		res.json({ownRecipes:ownRecipes})
	}
	 catch (err) {
		console.error('Erreur MySQL :', err);
		res.status(500).send('Erreur serveur');
	}
})


app.get('/getRecipesList',async(req,res) =>
{	

	try{
		let pseudoID=parseInt(req.cookies.pseudoID);
		const [recipesList] = await pool.execute('SELECT type, recipe.* FROM recipe_list JOIN recipe ON recipe_list.recipeID=recipe.id  WHERE userID = ?  AND type="favoris"', [pseudoID]);

		res.json({recipesList: recipesList})
	}
	 catch (err) {
		console.error('Erreur MySQL :', err);
		res.status(500).send('Erreur serveur');
	}
})


app.post('/createRecipe', (req, res) => {
	console.log(req.body);

	if (req.cookies.pseudoID) {
		let post = {
			title: req.body.title,
			description: req.body.description,
			image: req.body.image,
			totalTime: req.body.totalTime,
			yield: req.body.nbPerson,
			activeTime: req.body.activeTime,
			auteur: req.body.author,
			categoryID: req.body.categoryID,
		};

		var query = connection.query('INSERT INTO recipe SET ?', post,
			function (error, results, fields) {
				if (error) throw error;
				const recipeID = results.insertId;  // ← récupère l’ID auto-incrémenté
				console.log('Dernier recipeID inséré =', recipeID);

		let step = req.body.steps.filter(item => item !== null && item !== "");
		let tag = req.body.tags.filter(item => item !== null && item !== "");
		console.log(tag);


		let ingredient = req.body.ingredients;
		let measure = req.body.measures;

		// On filtre les deux tableaux en même temps :
		let filtered = ingredient
			.map((ing, index) => ({ ingredient: ing, measure: measure[index] }))
			.filter(item => item.ingredient && item.ingredient.trim() !== ""); // garde seulement si ingredient non vide

		// Puis on sépare à nouveau :
		ingredient = filtered.map(item => item.ingredient);
		measure = filtered.map(item => item.measure);

		console.log(ingredient); console.log(measure);

		const stepPost = step.map(txt => [txt, recipeID]);

		const ingPost = ingredient.map((ingTexte, index) => {
			const measureTexte = measure[index];      // correspondante
			return [ingTexte, measureTexte, recipeID];
		});


		listPost = {
			recipeID: recipeID,
			userID: req.cookies.pseudoID,
			type: 'ownrecipe',
		}

		const tagPost = tag.map(txt => [txt, recipeID]);
		console.log(tagPost);

				if (step.length > 0) {
					connection.query('INSERT INTO instructions (instruction, recipeID) VALUES ?', [stepPost], (err2) => {
						console.log("instructions insert");
						if (err2) throw err2;
					});
				}
				if (ingredient.length > 0) {
					connection.query('INSERT INTO liste_ingredients ( ingredient, measure, recipeID) VALUES ?', [ingPost], (err3) => {
						console.log("ingredients insert");

						if (err3) throw err3;
					});
				}

				if(tagPost.length>0){ 
				connection.query('INSERT IGNORE INTO tagslist (tag, recipeID) VALUES ?', [tagPost], (err4) => {
				console.log("tag insert");

					if (err4) console.log(err4);
				});
					}

				connection.query('INSERT IGNORE INTO recipe_list SET ?', listPost, (err4) => {
					console.log("list insert");
					if (err4) throw err4;
				});

			});
		console.log(query.sql); // INSERT INTO contact SET `id` = 1, `title` = 'Hello MySQL'
	}
	else {
		console.log("not connected!");
		res.json({succeed:true, message: "not connected"});}
	res.json({succeed:true});
	//res.redirect('/account')

});



app.post('/goRecipe', (req, res) => {
	console.log("url " + req.body.recipeID);
	res.clearCookie('recipeID');
	res.cookie('recipeID', req.body.recipeID, {
		maxAge: 3600000,   // expire dans 1h
		httpOnly: true,    // inaccessible côté client (document.cookie)
		secure: false,     // true si HTTPS
	});

	console.log(" recipe ID = " + req.body.recipeID);
	res.redirect('/recipe');
});

app.post('/addList', (req, res) => {
	//if (!pseudo) res.redirect('/recipe');

	console.log("url " + req.cookies.recipeID);
	if (req.cookies.pseudoID && req.cookies.recipeID)
		var query = connection.query('INSERT IGNORE INTO recipe_list(`recipeID`, `userID`, `type`) VALUES (?, ?, ?)'
			, [req.cookies.recipeID, req.cookies.pseudoID, "favoris"], function (error, results, fields) {
				if (error) {
					console.error('Erreur MySQL:', error.message);
					return;
				}
				let message="List Added";
				if(results.affectedRows===0) message="Already in List";
				console.log("donnée insérée :", results)
				res.json({message:message});
			});

});

// app.post('/deleteFav', (req, res) => {
// 	if (!pseudo) res.redirect('/');
// 	else {
// 		console.log(req.body.deleteFav);
// 		var query = connection.query(`DELETE FROM recipe_list WHERE recipeID = ? AND userID = ? AND type = 'favoris' `
// 			, [req.body.deleteFav, req.cookies.pseudoID], function (error, results, fields) {

// 				if (error) throw error;

// 				console.log("supprimée :", results)
// 				res.redirect('/account#fav');
// 			});
// 	}
// });


//delete own recipe completely on database
app.post('/deleteRecipeList', (req, res) => {
	console.log('données :'+req.body.recipeID+req.body.type+req.cookies.pseudoID);
	if (!req.cookies.pseudoID) res.json({checkUser:false});
	else {
		recipeID=req.body.recipeID;
		console.log(recipeID);
		var query = connection.query(`DELETE FROM recipe_list WHERE recipeID = ? AND userID = ? AND type = ? `
			, [recipeID, req.cookies.pseudoID,req.body.type], function (error, results, fields) {
				if (error) throw error;

				console.log("supprimée :", results)

			});

			if(req.body.type==='ownRecipe')
		{
			var query = connection.query(`DELETE FROM instructions WHERE recipeID= ?;DELETE FROM liste_ingredients WHERE recipeID= ?;
				DELETE FROM tagslist WHERE recipeID= ?;DELETE FROM recipe WHERE id= ?;
				DELETE FROM commentaires WHERE recipeID= ?;DELETE FROM notes WHERE recipeID= ?;`
				, [req.body.recipeID, req.body.recipeID, req.body.recipeID, req.body.recipeID, req.body.recipeID, req.body.recipeID], function (error, results, fields) {
					if (error) console.log(error);

					res.clearCookie('recipeID');
					console.log("supprimée :", results)
					res.json({check:true,checkUser:true});

				});

		}


	}
});

//delete own recipe completely on database
app.post('/deleteRecipe', (req, res) => {
	if (req.cookies.userRole!="admin") res.json({checkUser:false});
	else {
		recipeID=req.body.recipeID;
		var query = connection.query(`DELETE FROM recipe WHERE id = ? `
			, [recipeID], function (error, results, fields) {
				if (error) throw error;

				console.log("supprimée :", results)
	

			});

		var query = connection.query(`DELETE FROM instructions WHERE recipeID= ?;DELETE FROM liste_ingredients WHERE recipeID= ?;
				DELETE FROM tagslist WHERE recipeID= ?;DELETE FROM recipe WHERE id= ?;
				DELETE FROM commentaires WHERE recipeID= ?;DELETE FROM notes WHERE recipeID= ?;`
			, [recipeID, recipeID, recipeID, recipeID, recipeID, recipeID], function (error, results, fields) {
				if (error) console.log(error);

				console.log("supprimée :", results)
				res.clearCookie('recipeID');
				res.json({check:true,checkUser:true});
			});


	}
});


//search a recipe from search bar
app.post('/searchRecipes', (req, res) => {
	let filter = "";
	let textSearch = req.body.textSearch;
	let formSelect = req.body.formSelect ?? 'false';
	if (!req.body.formSelect) {
		textSearch = req.body.textSearch;
		res.cookie('searchKey', req.body.textSearch, {
			maxAge: 3600000,   // expire dans 1h
			httpOnly: true,    // inaccessible côté client (document.cookie)
			secure: false,     // true si HTTPS
		});
	} else {
		textSearch = req.cookies.searchKey;
		//differentes options du sortby form-select
		switch (req.body.searchFilter) {
			case 'title':
				filter = " ORDER BY title ASC";
				break;
			case 'date':
				filter = " ORDER BY date DESC";
				break;
			case 'note':
				filter = " ORDER BY note DESC";
				break;
			default:
				filter = "";
		}
	}
	console.log("textsearch : " + textSearch);

	connection.query(`SELECT recipeID FROM tagslist WHERE tag = ? ;SELECT id FROM category WHERE name = ? ;  `,
		[textSearch, textSearch], function (error, result, fields) {
			if (error) throw error;
			console.log(" searchKey = " + textSearch);
			console.log(result);

			const allRecipeIDs = [...result[0]];
			if (allRecipeIDs.length === 0) allRecipeIDs[0] = '0';
			const recipeIDs = allRecipeIDs.map(r => r.recipeID);
			const cleanRecipeIDs = [...new Set(recipeIDs)];

			let categoryID = result[1]?.[0]?.id || '0';

			connection.query(`SELECT * FROM recipe WHERE title LIKE ?  OR id in (?) OR categoryID=? ${filter} LIMIT 500 `,
				[`%${textSearch}%`, cleanRecipeIDs, categoryID], function (error, result, fields) {
					if (error) throw error;
					console.log(result);
					console.log(req.get('Referer'))
					JSON.stringify(result)
					res.json( {recipes: result});
				});

		});

});


//search a recipe from search bar
app.post('/searchRecipeHome', (req, res) => {
	let filter = "";
	let textSearch = req.body.textSearch;
	//let formSelect = req.body.formSelect ?? 'false';
	// if (!req.body.formSelect) {
	// 	textSearch = req.body.textSearch;
	// 	res.cookie('searchKey', req.body.textSearch, {
	// 		maxAge: 3600000,   // expire dans 1h
	// 		httpOnly: true,    // inaccessible côté client (document.cookie)
	// 		secure: false,     // true si HTTPS
	// 	});
	// } else {
		//textSearch = req.cookies.searchKey;
		//differentes options du sortby form-select
		switch (req.body.searchFilter) {
			case 'title':
				filter = " ORDER BY title ASC";
				break;
			case 'date':
				filter = " ORDER BY date DESC";
				break;
			case 'note':
				filter = " ORDER BY note DESC";
				break;
			default:
				filter = " ";
		}
	//}
	console.log("textsearch : " + textSearch);

	connection.query(`SELECT recipeID FROM tagslist WHERE tag = ? ;SELECT id FROM category WHERE name = ? ;  `,
		[textSearch, textSearch], function (error, result, fields) {

			if (error) throw error;
			console.log(" searchKey = " + textSearch);
			console.log(result);

			const allRecipeIDs = [...result[0]];
			if (allRecipeIDs.length === 0) allRecipeIDs[0] = '0';
			const recipeIDs = allRecipeIDs.map(r => r.recipeID);
			const cleanRecipeIDs = [...new Set(recipeIDs)];

			let categoryID = result[1]?.[0]?.id || '0';

			connection.query(`SELECT * FROM recipe WHERE title LIKE ?   OR id in (?) OR categoryID=? ${filter} LIMIT 150`,
				[`%${textSearch}%`, cleanRecipeIDs, categoryID], function (error, result, fields) {
					if (error) throw error;
					console.log(" searchKey = " + textSearch," filter : "+filter);
					//console.log(result);
					//console.log(req.get('Referer'))
					if (result) { 
					JSON.stringify(result)
					res.json( {recipes: result});
				 }

					if (result.length === 0) {
	
					}
					
				});

		});

});


app.post('/searchRecipeYT', (req, res) => {
	let textSearch = req.body.textSearch;
	
	connection.query(`SELECT * FROM recipe WHERE description LIKE '%youtube.com%' OR description 
					  LIKE '%youtu.be%' ORDER BY RAND() LIMIT 4 ;`,
		 function (error, result, fields) {
			if (error) throw error;
				
					res.json( {recipes: result});
				 				
				});
			
		});


//add note to BDD from html
app.post('/giveNote', async (req, res) => {
	console.log("note ; " + req.body.note + "id :" + req.cookies.pseudoID + " recipeid" + req.cookies.recipeID);
	let note = parseInt(req.body.note);
	console.log("note" + note);
	try {
		// Connect to the database using promises
		// const pool = await mysql2.createConnection({
		// 	host: process.env.DB_HOST,
		// 	user: process.env.DB_USER,
		// 	password: process.env.DB_PASSWORD,
		// 	database: process.env.DB_NAME,
		// });
		let recipeID = req.cookies.recipeID;

		const [existing] = await pool.execute(
			'SELECT note FROM notes WHERE userID = ? AND recipeID = ?',
			[req.cookies.pseudoID, recipeID]
		);
		let message='';
		console.log(recipeID+'pseudo id'+ req.cookies.pseudoID+ note)
		if (existing.length > 0) {
			// La note existe → on met à jour
			const [insertResult] = await pool.execute('UPDATE notes SET note = ? WHERE userID = ? AND recipeID = ?',
				[note, req.cookies.pseudoID, recipeID]);
			message="noteUpdated";
		} else {
			// La note n'existe pas → on insère
			await pool.execute('INSERT INTO notes (userID, recipeID, note) VALUES (?, ?, ?)',
				[req.cookies.pseudoID, recipeID, note]
			);
			message="noteInserted";

		}



		const [notesRes] = await pool.execute('SELECT SUM(note) AS somme,  COUNT(*) AS nbNotes FROM notes WHERE recipeID = ?',
			[recipeID]);

		noteMoy = notesRes[0].somme / notesRes[0].nbNotes;
		console.log(noteMoy);
		const [insertResult2] = await pool.execute('UPDATE recipe SET note = ? WHERE  id = ?',
			[noteMoy, recipeID]);
			
			res.json({succeed:true})

	} catch (err) {
		console.error('Erreur MySQL :', err);
		res.status(500).send('Erreur serveur');
	}
});

app.post('/addComment', async (req, res) => {
	console.log("comm :  " + req.body.comment + "   id :" + req.cookies.pseudoID + "   recipeid" + req.cookies.recipeID);
	let comment = req.body.comment;
	let recipeID = req.cookies.recipeID;
	let pseudoID = req.cookies.pseudoID;
	try {

		const [existing] = await pool.execute('SELECT commentaire FROM commentaires WHERE userID = ? AND recipeID = ?',
			[req.cookies.pseudoID, recipeID]);


		if (existing.length) {
			// La note existe → on met à jour
			const [insertResult] = await pool.execute('UPDATE commentaires SET commentaire = ? WHERE userID = ? AND recipeID = ?',
				[comment, req.cookies.pseudoID, recipeID]);
			console.log('commentaire "' + comment + '" modifié');
		} else {
			// La note n'existe pas → on insère
			await pool.execute(
				'INSERT INTO commentaires (userID, recipeID, commentaire) VALUES (?, ?, ?)',
				[pseudoID, recipeID, comment]);
			console.log('commentaire "' + comment + '" crée');

		}
		res.json({succeed:true});

	
	} catch (err) {
		console.error('Erreur MySQL :', err);
		res.status(500).send('Erreur serveur');
	}
});


app.post('/deleteComm', (req, res) => {
	const pseudo = req.cookies.pseudo;
	const recipeID = req.body.recipeID; 
	const userID = req.cookies.pseudoID;
	if (!userID) res.json({checkUser:false});
	else {
		console.log("recipeID to delete " + recipeID);
		var query = connection.query(`DELETE FROM commentaires WHERE recipeID = ? AND userID = ?  `
			, [recipeID, req.cookies.pseudoID], function (error, results, fields) {

				if (error) console.log(error) ;

				console.log("supprimée :", results)
				res.json({checkUser:true,check:true});			});
	}
});

app.post('/deleteCommAdmin', (req, res) => {
	const recipeID = req.body.recipeID; 
	const userID = req.body.pseudoID;
	if (req.cookies.userRole!="admin") res.redirect('/');
	else {
		console.log("recipeID to delete " + recipeID);
		var query = connection.query(`DELETE FROM commentaires WHERE recipeID = ? AND userID = ?  `
			, [recipeID, userID ], function (error, results, fields) {

				if (error) throw error;

				console.log("supprimée :", results);
				res.json({check:true});
			});
	}
});

app.post('/deleteNote',async (req, res) => {
	//const pseudo = req.cookies.pseudo;
	const recipeID = req.body.recipeID; 
	const userID = req.cookies.pseudoID;
	if (!userID) res.json({checkUser:false});
	else {

		try {
			await pool.execute('DELETE FROM notes WHERE recipeID = ? AND userID = ?',
				[recipeID, userID]   );

			const [note] = await pool.execute('SELECT AVG(note) AS averageNote FROM notes WHERE recipeID = ?', [recipeID]);
			console.log(note[0].averageNote);
			await pool.execute('UPDATE recipe SET note=? where id=?', [note[0].averageNote,recipeID]);
			return res.json({ check: true, checkUser: true });

		} catch (err) {
			console.error(err);
			return res.json({ check: false, checkUser: true, error: err.message });
		}		

	
	}
});


app.post('/modifyProfil', async (req, res) => {
	let pseudo = req.body.pseudo;
	let image = req.body.image;
	let description = req.body.description;
	let pseudoID = req.cookies.pseudoID;
	console.log(pseudo + image + description + pseudoID);
	try {

			const [pseudoCheck] = await pool.execute('SELECT * FROM users WHERE pseudo=?',
			[pseudo]);

			if(pseudoCheck.length>0 && pseudo!=req.cookies.pseudo){ res.json({message:"pseudo already exist"});}

		const [insertResult] = await pool.execute('UPDATE users SET pseudo = ?, image=?,description=? WHERE id=?',
			[pseudo, image, description, pseudoID]);


		console.log('commentaire ' + insertResult + 'modifié');

		res.cookie('pseudo', pseudo, {
			maxAge: 3600000,   // expire dans 1h
			httpOnly: true,    // inaccessible côté client (document.cookie)
			secure: false,     // true si HTTPS
		});

		res.json({message:'Profil udpated'});

	} catch (err) {
		console.error('Erreur MySQL :', err);
		res.status(500).send('Erreur serveur');
	}
});


app.post('/sendMailContact', (req, res) => {
	let checkMessage="";
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if(!regex.test(req.body.mail))checkMessage="mail incorrect";
	if(req.body.message===""){
		if(req.body.MessageCheck!="") checkMessage+=", "
		checkMessage+="message empty";
	}
	console.log(checkMessage);
	if(checkMessage!="") res.json({check: checkMessage})
	else{ 
	let textSubject = " Contact Message by " + req.body.name;
	let message=req.body.message + "\n\n Writed by " + req.body.name + "\n\n Email : " +req.body.mail;

	checkMessage=sendMail('droneuramateur@gmail.com'  ,textSubject,message);
	res.json({check: "Mail sent!" })


	}
	
});



function sendMail(mail,subject,text)
{
	let checkMessage="";
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if(!regex.test(mail))checkMessage="mail incorrect";
	console.log(checkMessage);
	if(checkMessage!="") return checkMessage;
	else{ 
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'droneuramateur@gmail.com',
			pass: 'vigw yvbl ducq bevq'
		}
	});

	let mailOptions = {
		from: 'droneuramateur@gmail.com',
		to: mail,
		subject: subject+' [RECIPE PROJECT]',
		text: text
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
			return error;
		} else {
			console.log('Email sent: ' + info.response);
			return "Mail sent!";
		}
	});

	}
}


app.post('/getPasswordMail', (req, res) => {
	let checkMessage="";
	let newPassword= crypto.randomBytes(16).toString('hex'); 

	const salt = bcrypt.genSaltSync(10);
	const hashmdp = bcrypt.hashSync(newPassword, salt);
	let mail= req.body.mail;

	connection.query('UPDATE users SET mdp=? where mail=?', [hashmdp,mail], function (error, result, fields) {
		if (error) throw error;
		// Neat!

		let textSubject="Get your password back from Gokhan Recipes ";
		message =` Bonjour, votre nouveau  mot de passe est ${newPassword}`
		checkMessage=sendMail(req.body.mail,textSubject,message);

		res.json({check:true})

		//if (!pseudo) res.render('login', { user: pseudo, erreur: "mailSent" });

			
			});

});



app.post('/changePassword', async(req, res) => {
	//console.log("changemdp" + req.body.passwordNew + req.body.passwordNew2)
		if(req.body.passwordNew!=req.body.passwordNew2 ) res.json({succeed : false, message: 'retape same password' })
		else if(req.body.passwordNew.length<4) res.json({succeed : false, message: 'minimum 4 characters' })
		else{ 
	try {
		// Connect to the database using promises
		// const pool = await mysql2.createConnection({
		// 	host: process.env.DB_HOST,
		// 	user: process.env.DB_USER,
		// 	password: process.env.DB_PASSWORD,
		// 	database: process.env.DB_NAME,
		// });
		let recipeID = req.cookies.recipeID;

	mdp = req.body.passwordCurrent;
	console.log(mdp);
	//check password
	
	const [checkPass] = await pool.execute('SELECT mdp FROM users WHERE id = ? ',[req.cookies.pseudoID]);
	let checkHash=false;
	if (checkPass && checkPass.length > 0) {
			hash = checkPass[0].mdp;
			console.log(checkPass[0].mdp);
			resultCompare = await bcrypt.compare(mdp, hash);
			
	
			if(resultCompare){
			console.log('Passwords match! ');				
			const salt = bcrypt.genSaltSync(10);
			const hashmdp = bcrypt.hashSync(req.body.passwordNew, salt);
			const [result] = await pool.execute('UPDATE users SET mdp=? where id=?',[hashmdp,req.cookies.pseudoID] );		
			console.log("change password!")
			res.json({ succeed : true,message: 'Password have been changed!' })
		}
			else{
			// Passwords don't match, authentication failed
			console.log('Passwords do not match! Authentication failed.');
			res.json({succeed : false, message: 'wrong password' })
			}

			}

	//res.redirect('/contact?form=ok&email='+req.body.email);
	//res.render('contact');
		} catch (err) {
        console.error(err);
        res.status(500).render('accounts', { user: null, erreur: "serverError" });
    }	

}
});

// --- GOOGLE AUTH ---
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

// --- FACEBOOK AUTH ---
app.get("/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

app.get("/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

// --- INSTAGRAM AUTH ---
app.get("/auth/instagram",
  passport.authenticate("instagram")
);

app.get("/auth/instagram/callback",
  passport.authenticate("instagram", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

// --- auth to BDD ---
app.get("/profile", async(req, res) => {
  if (!req.isAuthenticated())     res.redirect('http://localhost:5173'); 



   	try {
			const user = req.user;
			const mail = user.emails?.[0]?.value;
   			console.log(mail);

			const [mailCheck] = await pool.execute('SELECT * FROM users WHERE mail=?',[mail]);

			if(mailCheck.length===0){ 
			const [insertMail] = await pool.execute('INSERT INTO users (mail,pseudo) VALUES (?,"NoName")',[mail]);

			}

			const [userInfo] = await pool.execute('SELECT * FROM users WHERE mail=?',[mail]);

			let pseudo=userInfo[0]?.pseudo;
			let pseudoID=userInfo[0].id;
			let userRole= userInfo[0].role;
			
		console.log('pseudo ' + pseudo);

		res.cookie('pseudo', pseudo, {
			maxAge: 3600000,   // expire dans 1h
			httpOnly: true,    // inaccessible côté client (document.cookie)
			secure: false,     // true si HTTPS
		});

			res.cookie('pseudoID', pseudoID, {
			maxAge: 3600000,   // expire dans 1h
			httpOnly: true,    // inaccessible côté client (document.cookie)
			secure: false,     // true si HTTPS
		});

			res.cookie('userRole', userRole, {
			maxAge: 3600000,   // expire dans 1h
			httpOnly: true,    // inaccessible côté client (document.cookie)
			secure: false,     // true si HTTPS
		});		


    		res.redirect('http://localhost:5173'); 



	} catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Server error");
  }
});
