
const { DataTypes } = require('sequelize');

function createEventModel(sequelize) {
    const Event = sequelize.define('Event', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: true,
            validate: {
                min: -90,
                max: 90
            }
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: true,
            validate: {
                min: -180,
                max: 180
            }
        },
        eventDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        maxParticipants: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        organizerId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        categoryId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'id'
            }
        }
    }, {
        tableName: 'events'
    });

    return Event;
}

module.exports = createEventModel;