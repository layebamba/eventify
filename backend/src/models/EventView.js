const { DataTypes } = require('sequelize');

function createEventViewModel(sequelize) {
    const EventView = sequelize.define('EventView', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        eventId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'events',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: true, // null pour utilisateurs anonymes
            references: {
                model: 'users',
                key: 'id'
            }
        },
        viewDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userAgent: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'event_views',
        updatedAt: false
    });

    return EventView;
}

module.exports = createEventViewModel;