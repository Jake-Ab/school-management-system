const axios = require('axios');

async function createAdmin() {
    try {
        const res = await axios.post('http://localhost:8081/api/auth/register', {
            username: 'admin',
            password: 'password123',
            role: 'admin'
        });
        console.log("Admin generated successfully:", res.data);
    } catch (e) {
        console.log("Failed to create admin:", e.response ? e.response.data : e.message);
    }
}

createAdmin();