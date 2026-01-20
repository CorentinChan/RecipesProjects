
var http = require('http');
let url = require('url');
const fsp = require('fs').promises;
let express = require("express");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
let app = express();
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
const copyMealDBC = require('./copyDBMealC.js'); 



app.set('trust proxy', 1);


app.use(session({
	secret: process.env.DB_SECRET,      // session key
	resave: false,              // dont save if no change
	saveUninitialized: true,    // save empty sessions
	cookie: { maxAge: 3600000 } // life time  cookie (ms)
}));

app.use(passport.initialize());
app.use(passport.session());


//connection with mysql
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
	multipleStatements: true
});


app.listen(3000, () => {
	console.log(`Example app listening at http://localhost:3000`);
});

connection.connect(err => {
	console.log('DB_USER:', process.env.DB_USER);
	console.log('DB_PASS:', process.env.DB_PASS);
	if (err) {
		console.error('❌ Erreur de connexion à MySQL :', err.message);
	} else {
		console.log('✅ Connecté à la base MySQL !');
	}
});


	//initialize cookie
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'frontend'));

app.use(express.static(path.join(__dirname, '..', 'frontend')));

let pseudo = '';
let recipesMemo;
let recipesRecoMemo;
let videMemo;


//default route (home)
app.get('/', (req, res) => {
		res.redirect('home');
});


// another route for home
app.get('/home', (req, res) => {

	const pseudo = req.cookies.pseudo;
	
	let vide = req.cookies?.vide ?? false;
	if (videMemo === true) {
		//delete req.session.vide;
		res.clearCookie('vide');
		videMemo=false;
		//res.render('home', { user: pseudo, recipes: null,recipesRecommanded: req.cookies.recipesReco });
		res.render('home', { user: pseudo, recipes: null,recipesRecommanded: recipesRecoMemo });
	}
	else {
		if (( (recipesMemo)) && (req.get('Referer')?.includes('/home'))) { 
			recipes=recipesMemo;
			res.render('home', { user: pseudo,recipes: recipes,recipesRecommanded: recipesRecoMemo  });
		}
		else {
			let pseudo = req.cookies.pseudo;
			res.clearCookie('searchKey');
			connection.query(`  SELECT * from recipe LIMIT 300;
				SELECT * from recipe ORDER BY RAND() LIMIT 4;`,
				//SELECT * from recipe WHERE description LIKE 'https://www.youtube.com/%' OR description LIKE 'https://youtu.be/%'   ORDER BY RAND()  LIMIT 4;`,
				function (error, results, fields) {
					if (error) throw error;
					recipes = results[0];
					recipesMemo = results[0];
					let recipesReco = results[1];
					//req.session.recipesReco=results[1];
					recipesRecoMemo=results[1];


					console.log(results);console.log(fields);
					res.cookie('searchKey', "", {
						maxAge: 3600000,   // expire dans 1h
						httpOnly: true,    // inaccessible côté client (document.cookie)
						secure: false,     // true si HTTPS
					});
					res.render('home', { user: pseudo, recipes: recipes, recipesRecommanded: recipesReco });
				});
		}
	}
});


//route recipe
app.get('/recipe', async (req, res) => {
	try {
		// Connect to the database using promises
		const pool = await mysql2.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
		});

		const pseudo = req.cookies.pseudo;
		const pseudoID = req.cookies.pseudoID;
		let recipeID;

		//check if recipe exist in cookies , if not search a random recipe on database
		if (req.query.recipe) recipeID =req.query.recipe;
		else if (req.cookies.recipeID){ recipeID = req.cookies.recipeID; //req.session.recipeID = recipeID;   
			}
		 else{
			const [recipeIDres] = await pool.execute('SELECT id from recipe ORDER BY RAND() LIMIT 1;');
			 recipeID = recipeIDres[0].id ;

			res.cookie('recipeID', recipeID, {
				maxAge: 60 * 60 * 1000, // 1 jour
				httpOnly: true,              // inaccessible en JS client
				secure: false,               // mettre true si HTTPS
				sameSite: 'lax'              // protection CSRF basique
			});
		} 

		//SQL request for recipe data
		console.log(`${pseudo} : ${pseudoID} (recipeID = ${recipeID})`);
		const [recipeResult] = await pool.execute('SELECT * from recipe WHERE id = ?', [recipeID]);
		const [steps] = await pool.execute('SELECT * FROM instructions WHERE recipeID = ?', [recipeID]);
		const [ingredients] = await pool.execute('SELECT * FROM liste_ingredients WHERE recipeID = ?', [recipeID]);
		const [tags] = await pool.execute('SELECT * FROM tagslist WHERE recipeID = ?', [recipeID]);
		const [comment] = await pool.execute('SELECT commentaires.*,users.pseudo,users.image,users.mail FROM commentaires JOIN users ON commentaires.userID = users.id WHERE commentaires.recipeID = ? ;', [recipeID]);
		const [notes] = await pool.execute('SELECT * FROM notes WHERE recipeID = ?', [recipeID]);

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

		// select random recipe for section 'you may like also'
		let recipesForU = [];
		let i = 0;
		for (const recipeID of recipesID) {
			const [rows] = await pool.execute('SELECT * from recipe WHERE id = ?', [recipeID]);
			recipesForU.push(...rows);
			i++;
			if (i > 7) break;
		}

		console.log(recipesForU);

		userRole = req.cookies.userRole;

		res.render('recipe', {
			title: 'Recipe page', user: pseudo, recipe: recipe,instructions: steps, 
			ingredients: ingredients, tags: tags, commentaires: comment, notes: notes, 
			recipesForU: recipesForU, userRole : userRole, message : req.query.message
		});


	} catch (err) {
		console.error('Erreur MySQL :', err);
		res.status(500).send('Erreur serveur');
	}
});



//recipe form route
app.get('/recipeform', (req, res) => {
	pseudo = req.cookies.pseudo;
	connection.query('SELECT * FROM category ', function (error, result, fields) {
		if (error) {console.log(error);res.end();}

		console.log(result)
		res.render('recipeForm', { title: 'Recipe page', user: pseudo, category: result });

	});

});

// ban action by admin
app.post('/ban', (req, res) => {
	act = req.body.act;
	console.log(act);
	let sql;

	//check input
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!regex.test(req.body.pseudo))sql='UPDATE users SET role =? where pseudo= ? ';
	else sql='UPDATE users SET role =? where mail= ? ';

	if(act==="ban")role="ban";
	else role='user';
	connection.query(sql,[role,req.body.pseudo], function (error, result, fields) {
		if (error) {console.log(error);res.end();}
		console.log(result);
		
		if(result.affectedRows)	res.redirect(`/account?message=${act}#ownrecipe`)
		else res.redirect(`/account?message=noPseudo#ownrecipe`);
	});

});

// give admin role action by admin
app.post('/giveAdmin', (req, res) => {
	act = req.body.act;
	console.log(act);

	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	let sql;
	if (!regex.test(req.body.pseudo))sql='UPDATE users SET role =? where pseudo= ? ';
	else sql='UPDATE users SET role =? where mail= ? ';

	if(act==="giveAdmin")role="admin";
	else role='user';
	connection.query(sql,[role,req.body.pseudo], function (error, result, fields) {
		if (error) {console.log(error);res.end();}
		console.log(result);
	
	
		if(result.affectedRows)res.redirect(`/account?message=${act}#ownrecipe`);
		else res.redirect(`/account?message=noPseudo#ownrecipe`);
	});

});


app.post('/premodifyRecipe', (req, res) => {
	res.send(`
			<form id="myForm" action="/ModifyForm?recipe=${req.body.recipeID}" method="POST">
			<input type="text" name="username" value="Alice">
			</form>

			<script>
			// Soumission automatique
			document.getElementById('myForm').submit();
			</script>
			`);
});


// modify FORM ROUTE 
let recipeModID;
app.post('/modifyForm', async (req, res) => {
	try {
		// Connect to the database using promises
		const pool = await mysql2.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
		});

		const pseudo = req.cookies.pseudo;
		const pseudoID = req.cookies.pseudoID;
		recipeModID = req.query.recipe;
		let recipeID = recipeModID;
		console.log(`${pseudo} : ${pseudoID} (recipeID = ${recipeID})`);

		//select actual data recipe
		const [check] = await pool.execute('SELECT * from recipe_list WHERE recipeID = ? and userID=? and type="ownrecipe"', [recipeID, pseudoID]);
		if (check.length === 0 && req.cookies.userRole != "admin") res.send('No access role');
		const [recipeResult] = await pool.execute('SELECT * from recipe WHERE id = ?', [recipeID]);
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

		res.render('modifyForm', {
			title: 'Recipe page', user: pseudo, recipe: recipe, instructions: steps,
			ingredients: ingredients, tags: tags, commentaires: comment, notes: notes,
			message: req.query.message, category: category
		});


	} catch (err) {
		console.error('Erreur MySQL :', err);
		res.status(500).send('Erreur serveur');
	}

});

//modify recipe submit
app.post('/modifyRecipe', (req, res) => {

	
	var query = connection.query(`DELETE FROM instructions WHERE recipeID= ?;DELETE FROM liste_ingredients WHERE recipeID= ?;
				DELETE FROM tagslist WHERE recipeID= ?;
				`
			, [recipeModID, recipeModID, recipeModID], function (error, results, fields) {
				if (error) console.log(error);

				console.log("supprimée :", results)

	if (req.cookies.pseudo) {
		let post = {
			title: req.body.title,
			description: req.body.description,
			image: req.body.image,
			totalTime: req.body.totalTime,
			yield: req.body.yield,
			activeTime: req.body.activeTime,
			auteur: req.body.auteur,
			categoryID: req.body.category,
		};
		console.log('step :', req.body.step);
		console.log('ingredient :', req.body.ingredient);

		var query = connection.query('UPDATE recipe SET ? where id= ?', [post,recipeModID],
			function (error, results, fields) {
				if (error) throw error;
				const recipeID = results.insertId;  // get ID created
				
			let stepPost;
			if(req.body.step ){
				let step = req.body.step.filter(item => item !== null && item !== "");
				 stepPost = step.map(txt => [txt, recipeModID]);
	
			}
			console.log('recipeid'+recipeModID)
			console.log("ingredient body"+req.body.ingredient);
			console.log("tag body"+req.body.tag);

		let tag;
		if(req.body.tag && req.body.tag!=0){tag = req.body.tag.filter(item => item !== null && item !== "");
		console.log(tag);}
			console.log("tag body :" + req.body.tag + " ,tag : " + tag)

		// filter data input
		let ingPost;
		if(req.body.ingredient){
		let ingredient = req.body.ingredient;
		let measure = req.body.measure;

		let filtered = ingredient
			.map((ing, index) => ({ ingredient: ing, measure: measure[index] }))
			.filter(item => item.ingredient && item.ingredient.trim() !== ""); // on  garde seulement si ingredient non vide

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
		console.log(req.body.step  && req.body.step.length>0);
				if (req.body.step!=''  && req.body.step) {
					connection.query('INSERT INTO instructions (instruction, recipeID) VALUES ?', [stepPost], (err2) => {
						console.log("instructions insert");
						if (err2) throw err2;
					});
				}
				
				if (req.body.ingredient && req.body.ingredient!='') {
					connection.query('INSERT IGNORE INTO liste_ingredients ( ingredient, measure, recipeID) VALUES ?', [ingPost], (err3) => {
						console.log("ingredients insert");

						if (err3) throw err3;
					});
				}
				if(req.body.tag && req.body.tag!=""){const tagPost = tag.map(txt => [txt, recipeModID]);
				 
				connection.query('INSERT IGNORE INTO tagslist (tag, recipeID) VALUES ?', [tagPost], (err4) => {
				console.log("tag insert");

					if (err4) throw err4;
				});
					}
					console.log(req.body.ingredient)
		console.log("fin"); // INSERT INTO contact SET `id` = 1, `title` = 'Hello MySQL'
					 
					res.redirect('/account?message=recipeModified#ownrecipe')
					//if(url.pathname==="recipe") res.redirect('/recipe?message=recipeMod')

			});
	}
	else console.log("not connected!");

				});

});


//search route
app.get('/search', (req, res) => {
	pseudo = req.cookies.pseudo;


	connection.query('SELECT * from recipe LIMIT 500 ', function (error, result, fields) {
		if (error) throw error;
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


	});

});

//login or account route
app.get('/login', (req, res) => {
	console.log("login");
	let pseudo=req.cookies.pseudo ?? null;
	if (!pseudo) res.render('login', { user: pseudo, erreur: "" });
	else res.redirect('/account');

});

//account route
app.get('/account', async (req, res) => {
	if(!req.cookies.pseudo) res.redirect("/");
	else{ 
	const pseudo = req.cookies.pseudo;

	const pseudoID = req.cookies.pseudoID;

	try {
		const pool = await mysql2.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			multipleStatements: true

		});
		console.log(pseudoID)

		// get recipe ID 
		const [favIDResults] = await pool.query('SELECT recipeID from recipe_list WHERE userID = ? AND type = "favoris"', [pseudoID]);
		const [ownIDResults] = await pool.query('SELECT recipeID from recipe_list WHERE userID = ? AND type = "ownRecipe"', [pseudoID]);
		// get notes


		const recipesIDfav = favIDResults.map(r => r.recipeID);
		const recipesIDcreat = ownIDResults.map(r => r.recipeID);

		// security for empty values
		if (recipesIDfav.length === 0) recipesIDfav.push(null);
		if (recipesIDcreat.length === 0) recipesIDcreat.push(null);

		// Récupérer les recettes et info utilisateur
		const [recipeResults] = await pool.query(`
			SELECT * from recipe WHERE id IN (?);SELECT * from recipe WHERE id IN (?);SELECT * FROM users WHERE id = ?;
		`, [recipesIDfav, recipesIDcreat, pseudoID]);

		const fav = recipeResults[0];
		const created = recipeResults[1];
		const userInfo = recipeResults[2][0];
		if (!userInfo.image) userInfo.image = "https://picsum.photos/400/250?random=1";


		const [notesResults] = await pool.query('SELECT n.*, r.title FROM notes n JOIN recipe r ON n.recipeID = r.id WHERE n.userID = ?;', [pseudoID]);
		const notes = notesResults;

		const [commentsResults] = await pool.query('SELECT n.*, r.title FROM commentaires n JOIN recipe r ON n.recipeID = r.id WHERE n.userID = ?;', [pseudoID]);
		const comments = commentsResults;

		// Rendu de la page account
		res.render('account', {
			title: 'My Account', user: pseudo,userRole:req.cookies.userRole, userInfo: userInfo,
			recipes: fav, ownRecipes: created,
			notes: notes, commentaires: comments, openDiv : req.query.openDiv, message : req.query.message
		});


	} catch (err) {
		console.error('Erreur MySQL:', err);
		res.status(500).send('Erreur serveur');
	}

}

});

// Route /contact séparée
app.get('/contact', (req, res) => {
	const pseudo = req.cookies.pseudo;
	res.render('contact', { user: pseudo, erreur: "", messageCheck: '' });
});







//signup action
app.post('/signup', (req, res) => {
	
	//check data input
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!regex.test(req.body.mail))  {res.json({succeed: false, message : "mail format incorrect"});}

	
	var query = connection.query(`SELECT pseudo FROM users where pseudo= ?  `
	,[req.body.pseudo], function (error, results, fields) {
	if (results.length> 0 ) {res.json({succeed: false, message : "pseudo already exists"});}
	else{

	//password crypt with bcrypt

	const salt = bcrypt.genSaltSync(10);
	const hashmdp = bcrypt.hashSync(req.body.password, salt);

	//prepare data
	let post = {
		pseudo: req.body.pseudo,
		mail: req.body.mail,
		mdp: hashmdp,

	};

	var query = connection.query('INSERT IGNORE INTO users SET ?', post, function (error, results, fields) {
		if (error) throw error;

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

//logout button
app.post('/logout', (req, res) => {
	res.clearCookie('pseudo');
	res.clearCookie('pseudoID');
	res.clearCookie('userRole');
	console.log('Cookie "pseudo" supprimé ✅');
	res.redirect(req.get('referer'));
});

//login action
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

			// compare password input and password on database
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
					res.json({ succeed : true, message: "You are connected, redirect in 3s" });

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

// create recipe submit
app.post('/createRecipe', (req, res) => {
	console.log(req.body);

	if (pseudo) {
		let post = {
			title: req.body.title,
			description: req.body.description,
			image: req.body.image,
			totalTime: req.body.totalTime,
			yield: req.body.yield,
			activeTime: req.body.activeTime,
			auteur: req.body.auteur,
			categoryID: req.body.category,
		};


		var query = connection.query('INSERT INTO recipe SET ?', post,
			function (error, results, fields) {
				if (error) throw error;
				const recipeID = results.insertId;  // get ID created
				console.log('Dernier recipeID inséré =', recipeID);

let step = req.body.step.filter(item => item !== null && item !== "");
		let tag = req.body.tag.filter(item => item !== null && item !== "");
		console.log(tag);


		let ingredient = req.body.ingredient;
		let measure = req.body.measure;

		//data filter
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
	else console.log("not connected!");
	res.end(`<script>window.close;window.parent.location.reload(); </script>`);

});


//select a recipe on search
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


//add a recipe on favorite list
app.post('/addList', (req, res) => {

	console.log("url " + req.cookies.recipeID);
	if (req.cookies.pseudoID && req.cookies.recipeID)
		var query = connection.query('INSERT IGNORE INTO recipe_list(`recipeID`, `userID`, `type`) VALUES (?, ?, ?)'
			, [req.cookies.recipeID, req.cookies.pseudoID, "favoris"], function (error, results, fields) {
				if (error) {
					console.error('Erreur MySQL:', error.message);
					return;
				}
				let message="listAdded";
				if(results.affectedRows===0) message="listAlready";
				console.log("donnée insérée :", results)
				res.redirect(`/recipe?message=${message}`);
			});

});


// delete a recipe from favorite list
app.post('/deleteFav', (req, res) => {
	if (!pseudo) res.redirect('/');
	else {
		console.log(req.body.deleteFav);
		var query = connection.query(`DELETE from recipe_list WHERE recipeID = ? AND userID = ? AND type = 'favoris' `
			, [req.body.deleteFav, req.cookies.pseudoID], function (error, results, fields) {

				if (error) throw error;

				console.log("supprimée :", results)
				res.redirect('/account#fav');
			});
	}
});


//delete own recipe completely on database
app.post('/deleteOwn', (req, res) => {
	if (!pseudo) res.redirect('/');
	else {
		recipeID=req.body.deleteOwn;
		console.log(recipeID);
		var query = connection.query(`DELETE from recipe_list WHERE recipeID = ? AND userID = ? AND type = 'ownrecipe' `
			, [recipeID, req.cookies.pseudoID], function (error, results, fields) {
				if (error) throw error;

				console.log("supprimée :", results)

			});

		var query = connection.query(`DELETE FROM instructions WHERE recipeID= ?;DELETE FROM liste_ingredients WHERE recipeID= ?;
				DELETE FROM tagslist WHERE recipeID= ?;DELETE from recipe WHERE id= ?;
				DELETE FROM commentaires WHERE recipeID= ?;DELETE FROM notes WHERE recipeID= ?;`
			, [req.body.deleteOwn, req.body.deleteOwn, req.body.deleteOwn, req.body.deleteOwn, req.body.deleteOwn, req.body.deleteOwn], function (error, results, fields) {
				if (error) console.log(error);

				res.clearCookie('recipeID');
				console.log("supprimée :", results)
				res.redirect('/account#ownrecipe');
			});


	}
});

//delete own recipe completely on database
app.post('/deleteRecipe', (req, res) => {
	if (req.cookies.userRole!="admin") res.redirect('/');
	else {
		recipeID=req.body.recipeID;
		var query = connection.query(`DELETE from recipe_list WHERE recipeID = ? AND userID = ?  `
			, [recipeID, req.cookies.pseudoID], function (error, results, fields) {
				if (error) throw error;
				console.log("supprimée :", results)

			});

		var query = connection.query(`DELETE FROM instructions WHERE recipeID= ?;DELETE FROM liste_ingredients WHERE recipeID= ?;
				DELETE FROM tagslist WHERE recipeID= ?;DELETE from recipe WHERE id= ?;
				DELETE FROM commentaires WHERE recipeID= ?;DELETE FROM notes WHERE recipeID= ?;`
			, [recipeID, recipeID, recipeID, recipeID, recipeID, recipeID], function (error, results, fields) {
				if (error) console.log(error);

				console.log("supprimée :", results)
				res.clearCookie('recipeID');
				res.redirect('/account?message=recipeDeleted#ownrecipe');
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

			connection.query(`SELECT * from recipe WHERE title LIKE ?  OR id in (?) OR categoryID=? ${filter} LIMIT 500 `,
				[`%${textSearch}%`, cleanRecipeIDs, categoryID], function (error, result, fields) {
					if (error) throw error;
					console.log(result);
					console.log(req.get('Referer'))
					res.render('search', {
						title: 'Recipe page', user: pseudo,
						recipes: result
					});
				});

		});

});


//search a recipe from search bar
app.post('/searchRecipeHome', (req, res) => {
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

			connection.query(`SELECT * from recipe WHERE title LIKE ?   OR id in (?) OR categoryID=? ${filter} LIMIT 500`,
				[`%${textSearch}%`, cleanRecipeIDs, categoryID], function (error, result, fields) {
					if (error) throw error;
					console.log(" searchKey = " + textSearch);
					console.log(result);
					console.log(req.get('Referer'))
					if (result) { 
					//req.session.recipes = result;
					recipesMemo=result; }

					if (result.length === 0) {
					//req.session.vide = true;
					videMemo=true;
								res.cookie('vide', true, {
								maxAge: 60 * 60 * 1000, // 1 jour
								httpOnly: true,              // inaccessible en JS client
								secure: false,               // mettre true si HTTPS
								sameSite: 'lax'              // protection CSRF basique
							});
					}
					
					res.redirect('/home#searchResults');
				});

		});

});

//add note to BDD from html
app.post('/giveNote', async (req, res) => {
	console.log("note ; " + req.body.note + "id :" + req.cookies.pseudoID + " recipeid" + req.cookies.recipeID);
	let note = parseInt(req.body.note);
	console.log("note" + note);
	try {
		// Connect to the database using promises
		const pool = await mysql2.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
		});
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
		res.redirect('recipe?message=noteInserted#comments');
			


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
		// Connect to the database using promises
		const pool = await mysql2.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
		});

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
		res.redirect('recipe#comments');

	
	} catch (err) {
		console.error('Erreur MySQL :', err);
		res.status(500).send('Erreur serveur');
	}
});


app.post('/deleteComm', (req, res) => {
	const pseudo = req.cookies.pseudo;
	const recipeID = req.body.recipeIDComm; // attention à la casse ici
	const userID = req.cookies.pseudoID;
	if (!pseudo) res.redirect('/');
	else {
		console.log("recipeID to delete " + recipeID);
		var query = connection.query(`DELETE FROM commentaires WHERE recipeID = ? AND userID = ?  `
			, [recipeID, req.cookies.pseudoID], function (error, results, fields) {

				if (error) throw error;

				console.log("supprimée :", results)
				res.redirect('/account?openDiv=comments#comment');
			});
	}
});

app.post('/deleteCommAdmin', (req, res) => {
	//const pseudo = req.body.pseudo;
	const recipeID = req.body.recipeID; // attention à la casse ici
	const userID = req.body.pseudo;
	if (req.cookies.userRole!="admin") res.redirect('/');
	else {
		console.log("recipeID to delete " + recipeID);
		var query = connection.query(`DELETE FROM commentaires WHERE recipeID = ? AND userID = ?  `
			, [recipeID, userID ], function (error, results, fields) {

				if (error) throw error;

				console.log("supprimée :", results)
				res.redirect('/recipe#comments');
			});
	}
});

app.post('/deleteNote', (req, res) => {
	const pseudo = req.cookies.pseudo;
	const recipeIDnote = req.body.recipeIDnote; // attention à la casse ici
	const userID = req.cookies.pseudoID;
	if (!pseudo) res.redirect('/');
	else {
		console.log(recipeIDnote);
		var query = connection.query(`DELETE FROM notes WHERE recipeID = ? AND userID = ?  `
			, [recipeIDnote, req.cookies.pseudoID], function (error, results, fields) {

				if (error) throw error;

				console.log("supprimée :", results)
				res.redirect('/account?openDiv=note#comment');
			});
	}
});

//delete profil 
app.post('/deleteProfil', async (req, res) => {
	try {
		// Connect to the database using promises
		const pool = await mysql2.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
		});

		const pseudo = req.cookies.pseudo;
		const pseudoID = req.cookies.pseudoID;
		
		//delete commentaires and users data
		const [check] = await pool.execute('Delete from commentaires WHERE userID=? ', [ pseudoID]);
		const [checkDelete] = await pool.execute('delete  from users WHERE id=? ', [ pseudoID]);



	
	res.clearCookie('pseudo');
	res.clearCookie('pseudoID');
	res.clearCookie('userRole');
	console.log('Cookie "pseudo" supprimé ✅');
	res.redirect('/home');


	} catch (err) {
		console.error('Erreur MySQL :', err);
		res.status(500).send('Erreur serveur');
	}

});



app.post('/modifyProfil', async (req, res) => {
	let pseudo = req.body.pseudo;
	let image = req.body.image;
	let description = req.body.description;
	let pseudoID = req.cookies.pseudoID;
	console.log(pseudo + image + description + pseudoID);
	try {
		// Connect to the database using promises
		const pool = await mysql2.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
		});

			const [pseudoCheck] = await pool.execute('SELECT * FROM users WHERE pseudo=?',
			[pseudo]);

			if(pseudoCheck.length>0 && pseudo!=req.cookies.pseudo){ res.redirect('/account?openDiv=profil&message=pseudoExist');}

		const [insertResult] = await pool.execute('UPDATE users SET pseudo = ?, image=?,description=? WHERE id=?',
			[pseudo, image, description, pseudoID]);


		console.log('commentaire ' + insertResult + 'modifié');

		res.cookie('pseudo', pseudo, {
			maxAge: 3600000,   // expire dans 1h
			httpOnly: true,    // inaccessible côté client (document.cookie)
			secure: false,     // true si HTTPS
		});

		res.redirect('account');

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
	if(checkMessage!="") res.render('contact',{user : req.cookies.pseudo,messageCheck: checkMessage })
	else{ 
	let textSubject = " Contact Message by " + req.body.name;
	let message=req.body.message + "\n\n Writed by " + req.body.name + "\n\n Email : " +req.body.mail;

	checkMessage=sendMail(req.body.mail,textSubject,message);
	res.render('contact',{user : req.cookies.pseudo,messageCheck: "Mail sent!" })

	/*
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'droneuramateur@gmail.com',
			pass: 'vigw yvbl ducq bevq'
		}
	});

	let mailOptions = {
		from: 'droneuramateur@gmail.com',
		to: 'droneuramateur@gmail.com',
		subject: textSubject,
		text: message
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		res.render('contact',{MessageCheck: "Error" })

		} else {
			console.log('Email sent: ' + info.response);
			res.render('contact',{user : req.cookies.pseudo,messageCheck: "Message send!" })
		}
	});
*/
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
		subject: subject,
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

		if (!pseudo) res.render('login', { user: pseudo, erreur: "mailSent" });

			
			});

});


app.post('/copyMealDB', (req, res) => {

copyMealDBC(connection);
		
});




app.post('/changePassword', async(req, res) => {
	//console.log("changemdp" + req.body.passwordNew + req.body.passwordNew2)
		if(req.body.passwordNew!=req.body.passwordNew2 ) res.json({succeed : false, message: 'retape same password' })
		else if(req.body.passwordNew.length<8) res.json({succeed : false, message: 'minimum 8 characters' })
		else{ 
	try {
		// Connect to the database using promises
		const pool = await mysql2.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
		});
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
			//res.redirect('account');
			//res.render('account', { user: pseudo, recipes: recipes, recipesRecommanded: recipesReco, message : "passwordChanged" });
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
  if (!req.isAuthenticated()) return res.redirect("/");

   	try {
		// Connect to the database using promises
		const pool = await mysql2.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
		});

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


		res.redirect('account');



	} catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Server error");
  }
});


				 module.exports = app;
