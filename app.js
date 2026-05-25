const express = require('express');
const lodash = require('lodash');
const moment = require('moment');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Intentional hardcoded secrets for testing security scanners
const DATABASE_PASSWORD = 'SuperSecret123!';
const API_KEY = 'sk-abcd1234567890abcdef1234567890ab';
const JWT_SECRET = 'super-weak-secret-key-123';

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Vulnerable Test Application',
        timestamp: moment().format(),
        version: '1.0.0'
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: moment().format()
    });
});

// Vulnerable endpoint that uses lodash template (potential RCE)
app.post('/template', (req, res) => {
    try {
        const template = req.body.template || 'Hello <%= name %>!';
        const data = req.body.data || { name: 'World' };
        
        // This is vulnerable to template injection
        const compiled = lodash.template(template);
        const result = compiled(data);
        
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Vulnerable JWT endpoint
app.post('/jwt', (req, res) => {
    const payload = req.body.payload || { user: 'testuser' };
    
    // Using the hardcoded weak secret (vulnerable)
    const token = jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' });
    
    res.json({ token });
});

// Endpoint that makes external requests (potential SSRF)
app.post('/fetch', async (req, res) => {
    try {
        const url = req.body.url;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }
        
        // No URL validation - potential SSRF vulnerability
        const response = await axios.get(url);
        res.json({
            status: response.status,
            data: response.data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vulnerable test application running on port ${PORT}`);
    console.log(`Access it at http://localhost:${PORT}`);
});
