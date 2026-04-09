const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cookieParser());

app.use(cors({
     origin: process.env.FRONTEND_URL ,
     credentials: true
}));


//deplooyyyyyyyyyyyyy
// const allowedOrigins = [
//   "https://prep-pilot-frontend-sigma.vercel.app", // Your Sigma URL
//   "https://prep-pilot-green-eta.vercel.app",    // Your Green URL
//   "http://localhost:5173"                       // Your Localhost
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // 1. Allow requests with no origin (like mobile apps or Postman)
//     if (!origin) return callback(null, true);

//     // 2. Check if the origin is in our allowed list
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('CORS blocked: Origin not allowed'));
//     }
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

/////////

/* Routes */ 
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);


module.exports = app;