const { app } = require(".");
const { connectDb } = require("./config/db");

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
