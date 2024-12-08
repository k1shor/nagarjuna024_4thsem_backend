const multer = require('multer')
const fs = require('fs')  //file system
const path = require('path') //file path

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let destn = 'public/uploads'

        if (!fs.existsSync(destn)) {
            fs.mkdirSync(destn, { recursive: true })
        }

        cb(null, destn)
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname)
        let filename = path.basename(file.originalname, ext)

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + filename  + '-' + uniqueSuffix + ext)
    }
})

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 2000000
    }
 })

 module.exports = upload