'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //Chaque événement peut avoir plusieurs participants (utilisateurs).
      Event.hasMany(Inscription, { foreignKey: 'eventId' });
      //Chaque événement appartient à une seule catégorie.
      Event.belongsTo(Category, { foreignKey: 'categoryId' });
      // Un événement appartient à un seul utilisateur (organisateur)
      Event.belongsTo(User, { foreignKey: 'userId', as: 'organizer' });


    }
  }
  Event.init({
    title: DataTypes.STRING,
    location: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    date: DataTypes.DATE,
    isPublic: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};