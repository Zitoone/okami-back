const path = require('path')
const multer = require('multer')

//Config du storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/artists/')
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const name = path.basename(file.originalname, ext)
        cb(null, `${name}-${Date.now()}${ext}`)
    }
})

const upload = multer({ storage })

//Création du middleware
const multerMiddleware = (req, res, next) => {
    upload.single('pics')(req, res, (err) => {
    if (err) {
        console.error('Erreur Multer :', err)
        return res.status(400).json({ message: 'Erreur lors du téléchargement du fichier.' })
    }
    next()
    })
}

module.exports = multerMiddleware

//TODO: Mis en place de Sharp pour redimensionner les images