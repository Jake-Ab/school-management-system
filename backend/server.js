const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

let dbPool;

// Database Initialization
initDB().then(pool => {
    dbPool = pool;
    console.log("Database connection pool ready.");
}).catch(console.error);

// Inject Database Pool into Request for all routes
app.use((req, res, next) => {
    if (!dbPool) return res.status(503).json({ message: "Database initializing..." });
    req.db = dbPool;
    next();
});

// Auth Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Core CRUD Routes
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const academicRoutes = require('./routes/academicRoutes');

app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/academic', academicRoutes);

app.get('/', (req, res) => {
    return res.json({ message: "Server is running properly." });
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});