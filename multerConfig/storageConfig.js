const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
        const filename = `image-${Date.now()}-${file.originalname}`
        cb(null, filename)
    }
})

const fileFileter = (req, file, callback) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === "image/webp") {
        callback(null, true)
    } else {
        callback(null, false)
        return callback(new Error('Only .png, .jpg & .jpeg formatted accepted'))
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFileter
})

module.exports = upload;