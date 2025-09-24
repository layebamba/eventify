const cloudinary = require('cloudinary').v2;
const multer = require('multer');
let Event, User, Category;
/**
 * Initialise le modèle events
 * @param {Object} models - Les modèles Sequelize
 */
const initController = (models) => {
    Event = models.Event;
    User = models.User;
    Category = models.Category;
};


// Configuration Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuration multer pour Cloudinary
const upload = multer({
    storage: multer.memoryStorage(), // Stockage en mémoire
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        // Filtrer les types de fichiers
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Seules les images sont autorisées'), false);
        }
    }
});

const createEvent = async (req, res) => {
    const { title, description, location, latitude, longitude, eventDate, isPublic, maxParticipants, categoryName } = req.body;
    const organizerId = req.user.userId;

    try {
        let imageUrl = null;

        // Upload image vers Cloudinary si présente
        if (req.file) {
            console.log('Upload en cours vers Cloudinary...');

            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: 'events', // Organise dans un dossier
                        transformation: [
                            { width: 800, height: 600, crop: 'limit' }, // Redimensionnement
                            { quality: 'auto' } // Optimisation automatique
                        ],
                        format: 'webp' // Format optimisé
                    },
                    (error, result) => {
                        if (error) {
                            console.error('Erreur Cloudinary:', error);
                            reject(error);
                        } else {
                            console.log('Upload réussi:', result.public_id);
                            resolve(result);
                        }
                    }
                ).end(req.file.buffer);
            });

            imageUrl = result.secure_url;
        }

        // Vérifier la catégorie
        const category = await Category.findOne({ where: { name: categoryName } });
        if (!category) {
            return res.status(400).json({
                status: 'error',
                message: `Catégorie "${categoryName}" non trouvée`
            });
        }

        // Créer l'événement avec l'URL Cloudinary
        const newEvent = await Event.create({
            title,
            description,
            location,
            latitude,
            longitude,
            eventDate,
            imageUrl, // URL Cloudinary
            isPublic,
            maxParticipants,
            organizerId,
            categoryId: category.id
        });

        res.status(201).json({
            status: 'success',
            message: 'Événement créé avec succès',
            data: newEvent
        });

    } catch (error) {
        console.error('Erreur création événement:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la création de l\'événement',
            error: error.message
        });
    }
};
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll({
            where: {
                isPublic: true
            },
            include: [
                { model: User, as: 'organizer', attributes: ['id', 'firstName', 'lastName'] },
                { model: Category, as: 'category', attributes: ['id', 'name'] }
            ],
            order: [['eventDate', 'ASC']]
        });

        res.status(200).json({
            status: 'success',
            data: events,
            total: events.length
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération des événements',
            error: error.message
        });
    }
};


// READ: Récupérer un événement par ID
const getEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findOne({
            where: { id },
            include: [ { model: User, as: 'organizer' },
                { model: Category, as: 'category' }]
        });

        if (!event) {
            return res.status(404).json({
                status: 'error',
                message: 'Événement non trouvé'
            });
        }
        // Enregistrer automatiquement la vue
        try {
            await EventView.create({
                eventId: id,
                userId: req.user ? req.user.userId : null,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent')
            });
        } catch (viewError) {
        }

        res.status(200).json({
            status: 'success',
            data: event
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération de l\'événement',
            error: error.message
        });
    }
};
const getEventStats = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        // Vérifier que c'est son événement
        const event = await Event.findOne({
            where: { id, organizerId: userId }
        });

        if (!event) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        const viewCount = await EventView.count({ where: { eventId: id } });

        res.json({
            eventTitle: event.title,
            totalViews: viewCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE: Mettre à jour un événement
const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, description, location, latitude, longitude, eventDate, imageUrl, isPublic, maxParticipants, organizerId, categoryId } = req.body;

    try {
        const event = await Event.findOne({ where: { id } });

        if (!event) {
            return res.status(404).json({
                status: 'error',
                message: 'Événement non trouvé'
            });
        }

        // Mettre à jour les informations
        event.title = title || event.title;
        event.description = description || event.description;
        event.location = location || event.location;
        event.latitude = latitude || event.latitude;
        event.longitude = longitude || event.longitude;
        event.eventDate = eventDate || event.eventDate;
        event.imageUrl = imageUrl || event.imageUrl;
        event.isPublic = isPublic !== undefined ? isPublic : event.isPublic;
        event.maxParticipants = maxParticipants || event.maxParticipants;
        event.organizerId = organizerId || event.organizerId;
        event.categoryId = categoryId || event.categoryId;

        await event.save();

        res.status(200).json({
            status: 'success',
            message: 'Événement mis à jour avec succès',
            data: event
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la mise à jour de l\'événement',
            error: error.message
        });
    }
};

// DELETE: Supprimer un événement
const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findOne({ where: { id } });

        if (!event) {
            return res.status(404).json({
                status: 'error',
                message: 'Événement non trouvé'
            });
        }

        await event.destroy();

        res.status(200).json({
            status: 'success',
            message: 'Événement supprimé avec succès'
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la suppression de l\'événement',
            error: error.message
        });
    }
};
module.exports = {
    initController,
    createEvent,
    getAllEvents,
    getEventStats,
    upload,
    getEventById,
    updateEvent,
    deleteEvent
};