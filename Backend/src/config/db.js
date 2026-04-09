// const mongoose= require('mongoose');



// async function connectToDB(){
//     try{
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log('Connected to Database');
//     } catch (err) {
//         console.error('Error connecting to Database:',err);
//     }
// }

// module.exports= connectToDB;
const mongoose = require('mongoose');

let isConnected = false;

const connectToDB = async () => {
    // 1. Disable buffering so it throws an immediate error instead of waiting 10s
    mongoose.set('bufferCommands', false);

    if (isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Fail fast if no connection in 5s
        });
        isConnected = db.connections[0].readyState;
        console.log("Connected to Database");
    } catch (err) {
        console.error("Database Connection Error:", err.message);
        // Do not throw here, let the app handle it
    }
};

module.exports = connectToDB;