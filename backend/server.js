const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Pool } = require('pg');
const { Sequelize } = require('sequelize');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
// Configuration Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Eventify API',
            version: '1.0.0',
            description: 'API pour la gestion d\'événements Eventify'
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? 'https://eventify-xj6l.onrender.com'
                    : 'http://localhost:5000',
                description: process.env.NODE_ENV === 'production' ? 'Production' : 'Development'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./server.js','./src/routes/*.js']
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'eventify_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
});
// Configuration Sequelize
const sequelize = new Sequelize({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'eventify_db',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    dialect: 'postgres',
    logging: false
});
const createUserModel = require('./src/models/User');
const User = createUserModel(sequelize);
const createCategoryModel = require('./src/models/Category');
const Category = createCategoryModel(sequelize);
const createEventModel = require('./src/models/Event');
const Event = createEventModel(sequelize);
const createRegistrationModel = require('./src/models/Registration');
const Registration = createRegistrationModel(sequelize);
const createEventViewModel = require('./src/models/EventView');
const EventView = createEventViewModel(sequelize);
// Relations entre modèles
User.hasMany(Event, {
    foreignKey: 'organizerId',
    as: 'organizedEvents'
});

Event.belongsTo(User, {
    foreignKey: 'organizerId',
    as: 'organizer'
});

Category.hasMany(Event, {
    foreignKey: 'categoryId',
    as: 'events'
});

Event.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category'
});
// Relations pour Registration
User.hasMany(Registration, {
    foreignKey: 'userId',
    as: 'registrations'
});

Registration.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

Event.hasMany(Registration, {
    foreignKey: 'eventId',
    as: 'registrations'
});

Registration.belongsTo(Event, {
    foreignKey: 'eventId',
    as: 'event'
});

// Relations pour EventView
User.hasMany(EventView, {
    foreignKey: 'userId',
    as: 'eventViews'
});

EventView.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

Event.hasMany(EventView, {
    foreignKey: 'eventId',
    as: 'views'
});

EventView.belongsTo(Event, {
    foreignKey: 'eventId',
    as: 'event'
});
// Import des routes
const initAuthRoutes = require('./src/routes/auth');
const initEventRoutes = require('./src/routes/eventRoutes');
const initCategoryRoutes = require('./src/routes/categoryRoutes');
const initRegistrationRoutes = require('./src/routes/registrationRoutes');
const registrationRoutes = initRegistrationRoutes({ User, Category, Event, Registration, EventView });
const categoryRoutes = initCategoryRoutes({User, Category, Event, Registration, EventView });
const eventRoutes = initEventRoutes({ User, Category, Event, Registration, EventView });
const authRoutes = initAuthRoutes({ User, Category, Event, Registration, EventView });
async function testConnection() {
    try {
        console.log('🔍 Test de connexion PostgreSQL...');
        const client = await pool.connect();
        const result = await client.query('SELECT current_database(), current_user, version(), NOW()');
        const info = result.rows[0];

        console.log(' Connexion PostgreSQL réussie !');
        console.log(` Base de données: ${info.current_database}`);
        console.log(` Utilisateur: ${info.current_user}`);
        console.log(`  Version: ${info.version.split(' ')[0]}`);

        client.release();
        return { success: true, info };
    } catch (error) {
        console.error(' Erreur PostgreSQL:', error.message);
        return { success: false, error: error.message };
    }
}
// ===== MIDDLEWARE BASIQUES =====
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ===== ROUTES =====
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', (req, res) => {
    res.json({
        message: 'Serveur Eventify avec PostgreSQL !',
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
app.get('/api/v1/user', async (req, res) => {
    try {
        const userCount = await User.count();
        res.json({
            status: 'success',
            message: 'Modèle User fonctionne !',
            userCount: userCount,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur modèle User',
            error: error.message
        });
    }
});
app.get('/api/v1/category', async (req, res) => {
    try {
        const categoryCount = await Category.count();
        res.json({
            status: 'success',
            message: 'Modèle Category fonctionne !',
            categoryCount: categoryCount,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur modèle Category',
            error: error.message
        });
    }
});
app.get('/api/v1/event', async (req, res) => {
    try {
        const eventCount = await Event.count();
        res.json({
            status: 'success',
            message: 'Modèle Event fonctionne !',
            eventCount: eventCount,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur modèle Event',
            error: error.message
        });
    }
});
app.get('/api/v1/relations', async (req, res) => {
    try {
        const events = await Event.findAll({
            include: [
                { model: User, as: 'organizer' },
                { model: Category, as: 'category' }
            ],
            limit: 5
        });

        res.json({
            status: 'success',
            message: 'Relations fonctionnent !',
            eventsWithRelations: events.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur relations',
            error: error.message
        });
    }
});

app.get('/api/v1/eventview', async (req, res) => {
    try {
        const eventViewCount = await EventView.count();
        res.json({
            status: 'success',
            message: 'Modèle EventView fonctionne !',
            eventViewCount: eventViewCount,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur modèle EventView',
            error: error.message
        });
    }
});
app.get('/api/v1/allrelations', async (req, res) => {
    try {
        const events = await Event.findAll({
            include: [
                { model: User, as: 'organizer' },
                { model: Category, as: 'category' },
                { model: Registration, as: 'registrations' },
                { model: EventView, as: 'views' }
            ],
            limit: 3
        });

        res.json({
            status: 'success',
            message: 'Toutes les relations fonctionnent !',
            eventsFound: events.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur relations complètes',
            error: error.message
        });
    }
});
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/registrations', registrationRoutes);
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
        console.log(' Démarrage du serveur Eventify...');

        // Test DB
        const dbResult = await testConnection();
        if (!dbResult.success) {
            console.error(' Impossible de connecter à la DB');
            process.exit(1);
        }
        await sequelize.sync({ alter: true });
        console.log('✅ Table User créée !');

        app.listen(PORT, () => {
            console.log(' SERVEUR EVENTIFY + POSTGRESQL PRÊT !');
            console.log(`URL: http://localhost:${PORT}`);
            console.log(`  Test DB: http://localhost:${PORT}/api/v1/test-db`);
            console.log(`Base: ${dbResult.info.current_database}`);
        });

    } catch (error) {
        console.error(' Erreur démarrage:', error.message);
        process.exit(1);
    }
}

startServer();
