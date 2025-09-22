const { DataTypes } = require('sequelize');

function createUserModel(sequelize) {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('participant', 'organisateur'),
            allowNull: false,
            defaultValue: 'participant'
        }
    }, {
        tableName: 'users'
    });

    return User;
}

module.exports = createUserModel;