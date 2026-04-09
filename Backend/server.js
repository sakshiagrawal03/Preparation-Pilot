// // require('dotenv').config();
// const app = require('./src/app');
// const connectToDB = require('./src/config/db');

// connectToDB();  


// const PORT = process.env.PORT|| 3000;

// app.listen(PORT, () => {
//      console.log(`Server is running on port ${PORT}`);
// });

// module.exports = app;
// require('dotenv').config(); // Vercel handles this automatically
const app = require('./src/app');
const connectToDB = require('./src/config/db');

// 1. Better Database Connection Handling
connectToDB()
    .then(() => {
        console.log("Database connection initialized");
    })
    .catch((err) => {
        console.error("Database connection failed during startup:", err.message);
    });

// 2. Only run listen if NOT on Vercel
// Vercel sets an environment variable called 'VERCEL' automatically
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running locally on port ${PORT}`);
    });
}

// 3. This is the most important line for Vercel
module.exports = app;