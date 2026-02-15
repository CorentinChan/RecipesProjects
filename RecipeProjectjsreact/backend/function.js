const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 2. Configuration sécurisée du stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Stocker en dehors du dossier 'public' pour éviter l'exécution directe de scripts
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // SÉCURITÉ : Ne jamais garder le nom d'origine (file.originalname)
        // On génère un UUID + on garde l'extension d'origine
        const extension = path.extname(file.originalname);
        const uniqueName = uuidv4() + extension; 
        cb(null, uniqueName);
    }
});