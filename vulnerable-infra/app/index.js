// VULNERABILITY: Insecure code with potential SQL injection
exports.handler = async (event) => {
    const mysql = require('mysql');
    const AWS = require('aws-sdk');
    
    // VULNERABILITY: Hardcoded credentials
    const connection = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: 'admin',
        password: process.env.DATABASE_PASSWORD,
        database: 'users'
    });
    
    // VULNERABILITY: SQL Injection vulnerability
    const userId = event.queryStringParameters.userId;
    const query = `SELECT * FROM users WHERE id = ${userId}`; // No parameter sanitization
    
    // VULNERABILITY: Insecure logging of sensitive information
    console.log(`API Key: ${process.env.API_KEY}`);
    console.log(`Database Password: ${process.env.DATABASE_PASSWORD}`);
    
    // VULNERABILITY: Weak cryptography
    const crypto = require('crypto');
    const hash = crypto.createHash('md5').update('password').digest('hex'); // MD5 is insecure
    
    // VULNERABILITY: Insecure file operations
    const fs = require('fs');
    const userDataPath = `/tmp/${userId}.json`;
    fs.writeFileSync(userDataPath, JSON.stringify(event));
    
    // VULNERABILITY: Command injection
    const { exec } = require('child_process');
    exec(`echo ${event.data}`, (error, stdout, stderr) => {
        console.log(stdout);
    });
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Success'
        }),
    };
};
