const { app } = require(".");
const { connectDb } = require("./config/db");
const cloudinary = require('cloudinary');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });




const PORT=5454;
app.listen(PORT,async ()=>{
    console.log(`Server is running on port ${PORT}`);
    try {
        connectDb();
        console.log("Connected to database");
    } catch (error) {
        console.log("Error while connecting to the database", error);
    }
});
