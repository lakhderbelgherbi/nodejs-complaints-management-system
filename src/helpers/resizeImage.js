const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Images resizer function

module.exports = async function(file){
        // compress Photos
        await sharp(file.path).resize(500,500)
        .jpeg({quality: 90})
        .toFile(
          path.resolve(file.destination,'resized', file.filename)
      );
// const 
console.log('resized/'+ file.filename);    
fs.unlinkSync(file.path);
}