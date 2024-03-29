const { app } = require(".");
const { connectDb } = require("./config/db");
const cloudinary = require('cloudinary');
const multer = require('multer');
const isAdmin = require('./middleware/Admin');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const adminProductRouter = require('./routes/product.admin.routes.js');
app.use('/api/admin/products', isAdmin, adminProductRouter);

const adminOrderRoutes=require("./routes/adminOrder.routes.js");
app.use("/api/admin/orders",isAdmin,adminOrderRoutes);

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
