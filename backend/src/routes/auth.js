const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

let User;

const initAuthRoutes = (models) => {
    User = models.User;
    return router;
};
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [participant, organisateur]
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Email déjà utilisé
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, role } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'Email déjà utilisé'
            });
        }
        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            role: role || 'participant'
        });
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(201).json({
            status: 'success',
            message: 'Utilisateur créé avec succès',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de l\'inscription',
            error: error.message
        });
    }
});
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       400:
 *         description: Email ou mot de passe incorrect
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'Email ou mot de passe incorrect'
            });
        }
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Email ou mot de passe incorrect'
            });
        }
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.json({
            status: 'success',
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la connexion',
            error: error.message
        });
    }
});
/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Déconnexion utilisateur
 *     tags: [Authentification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *       401:
 *         description: Token invalide ou manquant
 */
router.post('/logout', async (req, res) => {
    try {
        res.json({
            status: 'success',
            message: 'Déconnexion réussie'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la déconnexion',
            error: error.message
        });
    }
});
/**
 * @swagger
 * /api/v1/auth/users:
 *   get:
 *     summary: Récupérer la liste de tous les utilisateurs
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: La liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   role:
 *                     type: string
 *       401:
 *         description: Non autorisé
 */
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'email', 'firstName', 'lastName', 'role']
        });
        res.status(200).json({
            status: 'success',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération des utilisateurs',
            error: error.message
        });
    }
});
/**
 * @swagger
 * /api/v1/auth/users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 role:
 *                   type: string
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            where: { id },
            attributes: ['id', 'email', 'firstName', 'lastName', 'role']
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Utilisateur non trouvé'
            });
        }

        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération de l\'utilisateur',
            error: error.message
        });
    }
});
/**
 * @swagger
 * /api/v1/auth/users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur par ID et retourner les anciennes et nouvelles données
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec les anciennes et nouvelles données
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 old:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     role:
 *                       type: string
 *                 new:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     role:
 *                       type: string
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur lors de la mise à jour
 */
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { email, firstName, lastName, role } = req.body;

    try {
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Utilisateur non trouvé'
            });
        }
        const oldUserData = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        };
        user.email = email || user.email;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.role = role || user.role;
        await user.save();
        res.status(200).json({
            status: 'success',
            message: 'Utilisateur mis à jour',
            data: {
                old: oldUserData,
                new: user
            }
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la mise à jour de l\'utilisateur',
            error: error.message
        });
    }
});
/**
 * @swagger
 * /api/v1/auth/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur par ID
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Utilisateur non trouvé'
            });
        }

        await user.destroy();

        res.status(200).json({
            status: 'success',
            message: 'Utilisateur supprimé'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la suppression de l\'utilisateur',
            error: error.message
        });
    }
});


module.exports = initAuthRoutes;
