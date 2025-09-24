let Category;
/**
 * Initialise le modèle Category
 * @param {Object} models - Les modèles Sequelize
 */
const initController = (models) => {
    Category = models.Category;
};


const createCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        const category = await Category.create({
            name,
            description
            // slug sera généré automatiquement par le hook
        });

        res.status(201).json({
            status: 'success',
            message: 'Catégorie créée avec succès',
            data: category
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la création de la catégorie',
            error: error.message
        });
    }
};
/*
const createCategory = async (req, res) => {
    if (!Category) return res.status(500).json({ status: 'error', message: 'Modèle Category non initialisé' });

    const { name, description } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ status: 'error', message: 'Le champ "name" est obligatoire' });
    }

    try {
        const category = await Category.create({ name, description });
        res.status(201).json({ status: 'success', message: 'Catégorie créée avec succès', data: category });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erreur lors de la création de la catégorie', error: error.message });
    }
};*/
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['name', 'ASC']]
        });

        res.status(200).json({
            status: 'success',
            data: categories,
            total: categories.length
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération des catégories',
            error: error.message
        });
    }
};

const getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findOne({
            where: { id }
        });

        if (!category) {
            return res.status(404).json({
                status: 'error',
                message: 'Catégorie non trouvée'
            });
        }

        res.status(200).json({
            status: 'success',
            data: category
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération de la catégorie',
            error: error.message
        });
    }
};

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const category = await Category.findOne({ where: { id } });

        if (!category) {
            return res.status(404).json({
                status: 'error',
                message: 'Catégorie non trouvée'
            });
        }

        category.name = name || category.name;
        category.description = description || category.description;
        // Le slug sera mis à jour automatiquement par le hook si le name change

        await category.save();

        res.status(200).json({
            status: 'success',
            message: 'Catégorie mise à jour avec succès',
            data: category
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la mise à jour de la catégorie',
            error: error.message
        });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findOne({ where: { id } });

        if (!category) {
            return res.status(404).json({
                status: 'error',
                message: 'Catégorie non trouvée'
            });
        }

        await category.destroy();

        res.status(200).json({
            status: 'success',
            message: 'Catégorie supprimée avec succès'
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la suppression de la catégorie',
            error: error.message
        });
    }
};

module.exports = {
    initController,
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};