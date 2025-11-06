const multer = require('multer');
const path = require('path');

module.exports = {
    upload: (folder, type = 'single') => {
        const storage = multer.diskStorage({
            destination: folder,
            filename: (req, file, callback) => {
                callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
            },
        });
        return type === 'single' ? multer({ storage }).single('IMG') : multer({ storage }).array('IMG', 10);
    },
};
