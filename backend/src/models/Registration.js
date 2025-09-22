const { DataTypes } = require('sequelize');

function createRegistrationModel(sequelize) {
    const Registration = sequelize.define('Registration', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        eventId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'events',
                key: 'id'
            }
        },
        registrationDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
            allowNull: false,
            defaultValue: 'confirmed'
        }
    }, {
        tableName: 'registrations',
        indexes: [
            {
                unique: true,
                fields: ['userId', 'eventId'],
                name: 'unique_user_event_registration'
            }
        ]
    });

    return Registration;
}

module.exports = createRegistrationModel;