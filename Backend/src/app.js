// const express = require('express');
// const cookieParser = require('cookie-parser');
// const app = express();
// const cors = require('cors');

// app.use(express.json());
// app.use(cookieParser());

// // app.use(cors({
// //      origin: process.env.FRONTEND_URL ,
// //      credentials: true
// // }));
// app.get("/", (req, res) => {
//     res.status(200).json({ message: "Prep Pilot Backend is Live!" });
// });
// app.use(cors({
//     origin: function (origin, callback) {
//         // Allow requests with no origin (like mobile apps or curl)
//         if (!origin) return callback(null, true);
        
//         const allowedOrigins = [
//             "http://localhost:5173",
//             "https://preparation-pilot12.vercel.app",
//             "https://preparation-pilot.vercel.app" // Add the main one too
//         ];

//         if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app")) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
// }));


// /* Routes */ 
// const authRouter = require('./routes/auth.routes');
// const interviewRouter = require('./routes/interview.routes');

// app.use('/api/auth', authRouter);
// app.use('/api/interview', interviewRouter);


// module.exports = app;
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

// 1. MUST BE FIRST: CORS Configuration
const allowedOrigins = [
    "http://localhost:5173",
    "https://preparation-pilot12.vercel.app",
    "https://preparation-pilot.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));

// 2. Standard Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Added for better form handling
app.use(cookieParser());

// 3. Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({ message: "Prep Pilot Backend is Live!" });
});

/* 4. API Routes */ 
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);

// 5. Global Error Handler (Prevents the 500 crash from hanging)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong on the server!" });
});

module.exports = app;