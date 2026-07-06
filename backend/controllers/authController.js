const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password required" });
        }
        
        const db = req.db;
        
        // Check if user exists
        const [existing] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Only allow valid roles, default to staff
        const validRoles = ['admin', 'teacher', 'staff'];
        const userRole = validRoles.includes(role) ? role : 'staff'; 

        const [result] = await db.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)', 
            [username, hashedPassword, userRole]
        );
        
        res.status(201).json({ message: "User registered successfully", userId: result.insertId });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password required" });
        }

        const db = req.db;
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        
        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const user = users[0];
        const match = await bcrypt.compare(password, user.password);
        
        if (!match) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Sign token with 1 Day expiration
        const token = jwt.sign(
            { id: user.id, role: user.role, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );
        
        res.json({ 
            message: "Login successful", 
            token, 
            user: { id: user.id, username: user.username, role: user.role } 
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};