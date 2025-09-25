const { DataTypes } = require('sequelize');

function createCategoryModel(sequelize) {
    const Category = sequelize.define('Category', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        tableName: 'categories',
        hooks: {
            beforeValidate: (category) => {
                if (!category.slug) {
                    category.slug = category.name
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');
                }
            },
            beforeUpdate: (category) => {
                if (category.changed('name') && !category.changed('slug')) {
                    category.slug = category.name
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');
                }
            }
        }
    });

    return Category;
}

module.exports = createCategoryModel;