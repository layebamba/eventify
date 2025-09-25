// Pour PostgreSQL (si tu utilises pg)
const sequelize = new Sequelize("eventify_db", "postgres", "passer", {
host: "localhost",
dialect: "postgres",
// port:5433,
logging: false
 });

module.exports = sequelize;