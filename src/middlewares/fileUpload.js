const util = require("util");
const multer = require('multer');

// files upload middleware

const maxSize = 2 * 1024 * 1024;

const fileFilter = (req, file, cb) =>{
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
}



let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,  'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, new Date().valueOf() + '_' +file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: fileFilter
}).single('avatar');

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;