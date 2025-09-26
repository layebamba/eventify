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
 *               isPublic:
 *                 type: boolean
 *               maxParticipants:
 *                 type: integer
 *               categoryName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Événement mis à jour avec succès
 *       404:
 *         description: Événement non trouvé
 */
router.put('/:id', authenticateToken,requireOrganizer, upload.single('image'), eventController.updateEvent);


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
 * /api/v1/events/organizer/stats:
 *   get:
 *     summary: Obtenir les statistiques globales de l'organisateur
 *     tags: [Événements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques globales de l’organisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 organizerId:
 *                   type: integer
 *                   description: ID de l’organisateur
 *                   example: 5
 *                 totalEvents:
 *                   type: integer
 *                   description: Nombre total d’événements créés par l’organisateur
 *                   example: 3
 *                 stats:
 *                   type: array
 *                   description: Liste des statistiques par événement
 *                   items:
 *                     type: object
 *                     properties:
 *                       eventId:
 *                         type: integer
 *                         example: 12
 *                       title:
 *                         type: string
 *                         example: "Conférence Tech 2025"
 *                       views:
 *                         type: integer
 *                         description: Nombre de vues de l’événement
 *                         example: 120
 *                       registrations:
 *                         type: integer
 *                         description: Nombre d’inscriptions à l’événement
 *                         example: 45
 *       401:
 *         description: Non authentifié (token manquant ou invalide)
 *       500:
 *         description: Erreur serveur
 */
router.get('/organizer/stats', authenticateToken, eventController.getOrganizerStats);
/**
 * @swagger
 * /api/v1/events/organizer/my-events:
 *   get:
 *     tags:
 *       - Events - Organizer
 *     summary: Récupérer tous mes événements
 *     description: Permet à un organisateur authentifié de récupérer tous ses événements (publics et privés)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des événements récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "Concert de musique traditionnelle"
 *                       description:
 *                         type: string
 *                         example: "Un événement culturel exceptionnel"
 *                       eventDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-25T20:00:00Z"
 *                       location:
 *                         type: string
 *                         example: "Centre culturel de Dakar"
 *                       maxParticipants:
 *                         type: integer
 *                         example: 100
 *                       isPublic:
 *                         type: boolean
 *                         example: true
 *                       organizer:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           firstName:
 *                             type: string
 *                             example: "Aminata"
 *                           lastName:
 *                             type: string
 *                             example: "Diallo"
 *                       category:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Musique"
 *                 total:
 *                   type: integer
 *                   example: 5
 *       401:
 *         description: Non autorisé - Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Token d'authentification requis"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Erreur lors de la récupération des événements"
 *                 error:
 *                   type: string
 *                   example: "Database connection error"
 */
router.get('/organizer/my-events', authenticateToken,eventController.getMyEvents);
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
