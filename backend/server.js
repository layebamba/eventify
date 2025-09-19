const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Pool } = require('pg');
require('dotenv').config();

// Créer l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Configuration PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'eventify_db',
    user: process.env.DB_USER || 'eventify_user',
    password: process.env.DB_PASSWORD || 'eventify123',
});

// Fonction de test de connexion
async function testConnection() {
    try {
        console.log('🔍 Test de connexion PostgreSQL...');
        const client = await pool.connect();
        const result = await client.query('SELECT current_database(), current_user, version(), NOW()');
        const info = result.rows[0];

        console.log('✅ Connexion PostgreSQL réussie !');
        console.log(`📊 Base de données: ${info.current_database}`);
        console.log(`👤 Utilisateur: ${info.current_user}`);
        console.log(`🗄️  Version: ${info.version.split(' ')[0]}`);

        client.release();
        return { success: true, info };
    } catch (error) {
        console.error('❌ Erreur PostgreSQL:', error.message);
        return { success: false, error: error.message };
    }
}

// ===== MIDDLEWARE BASIQUES =====
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== ROUTES =====

app.get('/', (req, res) => {
    res.json({
        message: '🎉 Serveur Eventify avec PostgreSQL !',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/v1/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API Eventify fonctionne !',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.get('/api/v1/test-db', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT COUNT(*) as tables FROM information_schema.tables WHERE table_schema = $1', ['public']);
        client.release();

        res.json({
            status: 'success',
            message: 'Base de données connectée !',
            tables_count: parseInt(result.rows[0].tables),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur DB',
            error: error.message
        });
    }
});

// Route 404
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.method} ${req.originalUrl} non trouvée`
    });
});

// ===== DÉMARRAGE =====
async function startServer() {
    try {
        console.log('🚀 Démarrage du serveur Eventify...');

        // Test DB
        const dbResult = await testConnection();
        if (!dbResult.success) {
            console.error('❌ Impossible de connecter à la DB');
            process.exit(1);
        }

        app.listen(PORT, () => {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🚀 SERVEUR EVENTIFY + POSTGRESQL PRÊT !');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`🌐 URL: http://localhost:${PORT}`);
            console.log(`🗄️  Test DB: http://localhost:${PORT}/api/v1/test-db`);
            console.log(`📊 Base: ${dbResult.info.current_database}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        });

    } catch (error) {
        console.error('❌ Erreur démarrage:', error.message);
        process.exit(1);
    }
}

startServer();