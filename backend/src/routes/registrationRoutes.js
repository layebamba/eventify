const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { authenticateToken } = require('../middleware/auth');

let Registration;

const initRegistrationRoutes = (models) => {
    Registration = models.Registration;
    registrationController.initController(models);
    return router;
};

/**
 * @swagger
 * /api/v1/registrations:
 *   get:
 *     summary: Récupérer toutes les inscriptions
 *     tags: [Inscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des inscriptions
 */
router.get('/', authenticateToken, registrationController.getAllRegistrations);

/**
 * @swagger
 * /api/v1/registrations:
 *   post:
 *     summary: Créer une inscription pour un événement
 *     tags: [Inscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Inscription créée avec succès
 *       400:
 *         description: Déjà inscrit à cet événement
 */
router.post('/', authenticateToken, registrationController.createRegistration);

/**
 * @swagger
 * /api/v1/registrations/{id}:
 *   get:
 *     summary: Récupérer une inscription par ID
 *     tags: [Inscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'inscription
 *     responses:
 *       200:
 *         description: Inscription trouvée
 *       404:
 *         description: Inscription non trouvée
 */
router.get('/:id', authenticateToken, registrationController.getRegistrationById);

/**
 * @swagger
 * /api/v1/registrations/{id}:
 *   put:
 *     summary: Mettre à jour une inscription
 *     tags: [Inscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'inscription
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled]
 *                 description: Nouveau statut de l'inscription
 *     responses:
 *       200:
 *         description: Inscription mise à jour avec succès
 *       404:
 *         description: Inscription non trouvée
 *       500:
 *         description: Erreur interne
 */
   router.put('/:id', authenticateToken, registrationController.updateRegistration);
/**
 * @swagger
 * /api/v1/registrations/{id}:
 *   delete:
 *     summary: Supprimer une inscription
 *     tags: [Inscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'inscription
 *     responses:
 *       200:
 *         description: Inscription supprimée avec succès
 *       404:
 *         description: Inscription non trouvée
 */
router.delete('/:id', authenticateToken, registrationController.deleteRegistration);

module.exports = initRegistrationRoutes;
