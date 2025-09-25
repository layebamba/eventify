const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
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
        tableName: 'users',
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 12);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, 12);
                }
            }
        }
    });
    User.prototype.comparePassword = async function(password) {
        return await bcrypt.compare(password, this.password);
    };
    return User;
}

module.exports = createUserModel;