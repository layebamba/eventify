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
        tableName: 'categories'
    });

    return Category;
}

module.exports = createCategoryModel;