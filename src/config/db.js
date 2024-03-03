


const mongoose = require('mongoose');

const mondbUrl = "mongodb+srv://sventures815:D1d2d3d4d5@cluster1.3wzjcur.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";


const connectDb = async() => {
   return await mongoose.connect(mondbUrl);
}

module.exports = { connectDb };
