const cloudinary = require('cloudinary').v2;
const multer = require('multer');
let Event, User, Category, EventView, Registration;
/**
 * Initialise le modèle events
 * @param {Object} models - Les modèles Sequelize
 */
const initController = (models) => {
    Event = models.Event;
    User = models.User;
    Category = models.Category;
    EventView = models.EventView;
    Registration = models.Registration;
};


// Configuration Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuration multer pour Cloudinary
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
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
        if (req.file) {
            console.log('Upload en cours vers Cloudinary...');
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: 'events',
                        transformation: [
                            { width: 800, height: 600, crop: 'limit' },
                            { quality: 'auto' }
                        ],
                        format: 'webp'
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
        const category = await Category.findOne({ where: { name: categoryName } });
        if (!category) {
            return res.status(400).json({
                status: 'error',
                message: `Catégorie "${categoryName}" non trouvée`
            });
        }
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

const getMyEvents = async (req, res) => {
    try {
        const organizerId = req.user.userId;

        const events = await Event.findAll({
            where: {
                organizerId: organizerId
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
        const registrationCount = await Registration.count({ where: { eventId: id } });

        res.json({
            eventId: event.id,
            title: event.title,
            totalViews: viewCount,
            totalRegistrations: registrationCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getOrganizerStats = async (req, res) => {
    console.log(req.user);
    const organizerId = Number(req.user.userId);

    try {
        console.log("organizerId:", organizerId, typeof organizerId);
        // Récupérer les événements de l’organisateur
        const events = await Event.findAll({
            where: { organizerId },
            attributes: ['id', 'title','isPublic']
        });

        // Récupérer stats pour chaque event
        const stats = await Promise.all(events.map(async (event) => {
            const views = await EventView.count({ where: { eventId: event.id } });
            const registrations = await Registration.count({ where: { eventId: event.id } });

            return {
                eventId: event.id,
                title: event.title,
                views,
                registrations,
                isPublic: event.isPublic
            };
        }));

        res.status(200).json({
            status: 'success',
            organizerId,
            totalEvents: events.length,
            stats
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// UPDATE: Mettre à jour un événement
const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, description, location, latitude, longitude, eventDate, isPublic, maxParticipants, categoryName } = req.body;
    const organizerId = req.user.userId;

    try {
        const event = await Event.findOne({ where: { id } });
        if (!event) {
            return res.status(404).json({ status: 'error', message: 'Événement non trouvé' });
        }

        // Gestion de l'image Cloudinary
        let imageUrl = event.imageUrl;
        if (req.file) {
            console.log('Upload en cours vers Cloudinary...');
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: 'events',
                        transformation: [
                            { width: 800, height: 600, crop: 'limit' },
                            { quality: 'auto' }
                        ],
                        format: 'webp'
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(req.file.buffer);
            });
            imageUrl = result.secure_url;
        }

        let categoryId = event.categoryId;
        if (categoryName) {
            const category = await Category.findOne({ where: { name: categoryName } });
            if (!category) {
                return res.status(400).json({
                    status: 'error',
                    message: `Catégorie "${categoryName}" non trouvée`
                });
            }
            categoryId = category.id;
        }

        event.title = title ?? event.title;
        event.description = description ?? event.description;
        event.location = location ?? event.location;
        event.latitude = latitude ? parseFloat(latitude) : event.latitude;
        event.longitude = longitude ? parseFloat(longitude) : event.longitude;
        event.isPublic = isPublic === 'true' ? true : isPublic === 'false' ? false : event.isPublic;
        event.maxParticipants = maxParticipants ? parseInt(maxParticipants) : event.maxParticipants;

        event.imageUrl = imageUrl;

        event.organizerId = organizerId;
        event.categoryId = categoryId;

        await event.save();

        res.status(200).json({
            status: 'success',
            message: 'Événement mis à jour avec succès',
            data: event
        });

    } catch (error) {
        console.error('Erreur mise à jour événement:', error);
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
    getOrganizerStats,
    getMyEvents,
    updateEvent,
    deleteEvent
};