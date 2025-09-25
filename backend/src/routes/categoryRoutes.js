const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

let Category;
const initCategoryRoutes = (models) => {
    categoryController.initController(models);
    Category = models.Category;
    return router;
};

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Récupérer toutes les catégories
 *     tags: [Catégories]
 *     responses:
 *       200:
 *         description: Liste des catégories
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
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                 total:
 *                   type: integer
 */
router.get('/', categoryController.getAllCategories);

/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     summary: Créer une catégorie
 *     tags: [Catégories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Catégorie créée avec succès
 */
router.post('/', categoryController.createCategory);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Récupérer une catégorie par ID
 *     tags: [Catégories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Catégorie trouvée
 *       404:
 *         description: Catégorie non trouvée
 */
router.get('/:id', categoryController.getCategoryById);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Mettre à jour une catégorie
 *     tags: [Catégories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Catégorie mise à jour avec succès
 *       404:
 *         description: Catégorie non trouvée
 */
router.put('/:id', categoryController.updateCategory);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   delete:
 *     summary: Supprimer une catégorie
 *     tags: [Catégories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Catégorie supprimée avec succès
 *       404:
 *         description: Catégorie non trouvée
 */
router.delete('/:id', categoryController.deleteCategory);

module.exports = initCategoryRoutes;
