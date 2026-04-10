
const mongoose = require('mongoose');

// We use a global variable to cache the connection in serverless environments
let isConnected = false;

const connectToDB = async () => {
    // 1. Disable buffering 
    // This forces Mongoose to throw an error immediately if the DB isn't connected,
    // rather than letting the request hang for 10 seconds.
    mongoose.set('bufferCommands', false);

    // 2. If already connected, don't re-connect
    if (isConnected) {
        return;
    }

    try {
        // 3. Establish connection
        const db = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
            // These options ensure stable connection on Atlas
            retryWrites: true,
            w: 'majority'
        });

        // 4. Update the connection state
        isConnected = db.connections[0].readyState;
        
        console.log("Database connection initialized");
        return db;
    } catch (err) {
        console.error("Database Connection Error:", err.message);
        // Important: If connection fails, we reset isConnected so next request tries again
        isConnected = false;
        throw err; // Throw so the controller/middleware knows to stop
    }
};

module.exports = connectToDB;