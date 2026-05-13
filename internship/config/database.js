const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const poolConfig = {
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '3306'),
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'internship_provider',
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    connectTimeout: 60000,
    // SSL for Aiven, Railway, PlanetScale — any non-localhost host
    ...(process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && {
        ssl: { rejectUnauthorized: false }
    }),
};

const pool = mysql.createPool(poolConfig);
const promisePool = pool.promise();

// Test connection on startup
promisePool.query('SELECT 1')
    .then(() => console.log('✅ Database connected successfully'))
    .catch(err => console.error('❌ Database connection failed:', err.message));

module.exports = { pool, promisePool };
