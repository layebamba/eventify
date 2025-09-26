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
            unique: true,
            validate: {
                is: {
                    args: /^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/,
                    msg: "Format email invalide (pas d'espaces ou tirets autorisés)"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [6, 50],
                    msg: "Mot de passe entre 6 et 50 caractères"
                },
                is: {
                    args: /^[^\s-]+$/,
                    msg: "Mot de passe ne doit pas contenir d'espaces ou tirets"
                }
            }
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 50],
                    msg: "Le prénom doit contenir entre 2 et 50 caractères"
                },
                is: {
                    args: /^[a-zA-ZÀ-ÿ]+$/,
                    msg: "Le prénom ne doit contenir que des lettres (pas d'espaces)"
                }
            }

        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [2, 50],
                    msg: "Le nom doit contenir entre 2 et 50 caractères"
                },
                is: {
                    args: /^[a-zA-ZÀ-ÿ]+$/,
                    msg: "Le nom ne doit contenir que des lettres (pas d'espaces)"
                }
            }
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