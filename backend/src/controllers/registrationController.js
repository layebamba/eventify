let Registration, User, Event;

const initController = (models) => {
    Registration = models.Registration;
    User = models.User;
    Event = models.Event;
};

// Créer une inscription
const createRegistration = async (req, res) => {
    const { eventId } = req.body;
    const userId = req.user.userId;

    try {
        // Vérifier si déjà inscrit
        const existingRegistration = await Registration.findOne({
            where: { userId, eventId }
        });

        if (existingRegistration) {
            return res.status(400).json({
                status: 'error',
                message: 'Déjà inscrit à cet événement'
            });
        }

        const registration = await Registration.create({
            userId,
            eventId
        });

        res.status(201).json({
            status: 'success',
            data: registration
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
};

// Récupérer toutes les inscriptions
const getAllRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.findAll({
            include: [
                { model: User, as: 'user' },
                { model: Event, as: 'event' }
            ]
        });

        res.status(200).json({
            status: 'success',
            data: registrations,
            total: registrations.length
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
};
// Récupérer une inscription par ID
const getRegistrationById = async (req, res) => {
    const { id } = req.params;
    try {
        const registration = await Registration.findByPk(id, {
            include: [
                { model: User, as: 'user' },
                { model: Event, as: 'event' }
            ]
        });

        if (!registration) {
            return res.status(404).json({
                status: 'error',
                message: 'Inscription non trouvée'
            });
        }

        res.status(200).json({
            status: 'success',
            data: registration
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
};
const updateRegistration = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;

    try {
        const registration = await Registration.findOne({
            where: { id, userId } // Seulement ses propres inscriptions
        });

        if (!registration) {
            return res.status(404).json({
                status: 'error',
                message: 'Inscription non trouvée'
            });
        }

        registration.status = status || registration.status;
        await registration.save();

        res.json({
            status: 'success',
            data: registration
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
};
// Supprimer une inscription
const deleteRegistration = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        const registration = await Registration.findOne({
            where: {
                id: id,
                userId: userId  // Seulement ses propres inscriptions
            }
        });

        if (!registration) {
            return res.status(404).json({
                status: 'error',
                message: 'Inscription non trouvée'
            });
        }

        await registration.destroy();

        res.status(200).json({
            status: 'success',
            message: 'Inscription supprimée avec succès'
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
};

module.exports = {
    initController,
    createRegistration,
    getAllRegistrations,
    getRegistrationById,
    updateRegistration,
    deleteRegistration
};
