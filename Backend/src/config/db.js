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

async function connectToDB() {
    // Check if we already have a connection (readyState 1 = connected)
    if (mongoose.connection.readyState === 1) {
        console.log('Using existing database connection');
        return;
    }

    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is missing from Environment Variables');
        }

        // Configuration to help Vercel avoid timeouts
        const options = {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000,         // Close sockets after 45s
        };

        await mongoose.connect(process.env.MONGO_URI, options);
        console.log('Connected to Database');
    } catch (err) {
        console.error('Error connecting to Database:', err.message);
        throw err; 
    }
}

module.exports = connectToDB;