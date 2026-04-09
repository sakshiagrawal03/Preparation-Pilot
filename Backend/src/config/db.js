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

// Create a variable to cache the connection
let isConnected = false; 

async function connectToDB() {
    // If already connected, don't try again
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is missing from Environment Variables');
        }

        const db = await mongoose.connect(process.env.MONGO_URI);
        
        isConnected = db.connections[0].readyState;
        console.log('Connected to Database');
    } catch (err) {
        console.error('Error connecting to Database:', err.message);
        // On Vercel, it's better to throw the error so the function fails fast
        throw err; 
    }
}

module.exports = connectToDB;