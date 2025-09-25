'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Un utilisateur peut créer plusieurs événements (s’il est organisateur)
      User.hasMany(models.Event, { foreignKey: 'userId' });
      //Chaque utilisateur peut s’inscrire à plusieurs événements.
      User.hasMany(Inscription, { foreignKey: 'userId' });
      //Un utilisateur (organisateur) peut créer plusieurs événements
      User.hasMany(Event, { foreignKey: 'userId', as: 'organizedEvents' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('participant','organisateur')
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};