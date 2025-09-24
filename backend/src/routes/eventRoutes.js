const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateToken, requireOrganizer } = require('../middleware/auth');
const EventController = require("../controllers/eventController");
const { upload } = require('../controllers/eventController');


let Event, User, Category;
const initEventRoutes = (models) => {
    EventController.initController(models);
    Event = models.Event;
    User = models.User;
    Category = models.Category;
    return router;
};
/**
 * @swagger
 * /api/v1/events:
 *   get:
 *     summary: Récupérer tous les événements publics
 *     tags: [Événements]
 *     responses:
 *       200:
 *         description: Liste des événements publics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 */
router.get('/', eventController.getAllEvents);
/**
 * @swagger
 * /api/v1/events:
 *   post:
 *     summary: Créer un événement avec image
 *     tags: [Événements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               eventDate:
 *                 type: string
 *                 format: date-time
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image de l'événement
 *               isPublic:
 *                 type: boolean
 *               maxParticipants:
 *                 type: integer
 *               categoryName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Événement créé avec succès
 *       500:
 *         description: Erreur interne
 */
    router.post('/', authenticateToken, requireOrganizer, upload.single('image'), eventController.createEvent);
/**
 * @swagger
 * /api/v1/events/{id}:
 *   get:
 *     summary: Récupérer un événement par ID
 *     tags: [Événements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'événement
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de l'événement
 *       404:
 *         description: Événement non trouvé
 */
router.get('/:id', eventController.getEventById);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   put:
 *     summary: Mettre à jour un événement par ID
 *     tags: [Événements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'événement
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               eventDate:
 *                 type: string
 *                 format: date-time
 *               imageUrl:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *               maxParticipants:
 *                 type: integer
 *               organizerId:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Événement mis à jour avec succès
 *       404:
 *         description: Événement non trouvé
 */
router.put('/:id',requireOrganizer, eventController.updateEvent);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   delete:
 *     summary: Supprimer un événement par ID
 *     tags: [Événements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'événement
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Événement supprimé avec succès
 *       404:
 *         description: Événement non trouvé
 */
router.delete('/:id',requireOrganizer, eventController.deleteEvent);
/**
 * @swagger
 * /api/v1/events/{id}/stats:
 *   get:
 *     summary: Voir les statistiques de vues de son événement
 *     tags: [Événements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'événement
 *     responses:
 *       200:
 *         description: Statistiques de l'événement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 eventTitle:
 *                   type: string
 *                   description: Titre de l'événement
 *                 totalViews:
 *                   type: integer
 *                   description: Nombre total de vues
 *       403:
 *         description: Accès non autorisé - Pas votre événement
 *       404:
 *         description: Événement non trouvé
 */
router.get('/:id/stats', authenticateToken, eventController.getEventStats);

module.exports = initEventRoutes;
