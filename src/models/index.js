const { Sequelize } = require("sequelize");

const Model = {};

// In a real app, you should keep the database connection URL as an environment variable.
// But for this example, we will just use a local SQLite database.
// const sequelize = new Sequelize(process.env.DB_CONNECTION_URL);
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "db",
  logQueryParameters: true,
  benchmark: true,
});

Model.Thread = require("./thread")(sequelize);
Model.Message = require("./message")(sequelize);
// Add more models here...
// require('./models/item'),

// We define all models according to their files.

Object.keys(Model).forEach((key) => {
  const model = Model[key];
  if (model.associate) {
    model.associate(Model);
  }
});

Model.Sequelize = Sequelize;
Model.sequelize = sequelize;

// We export the sequelize connection instance to be used around our app.
module.exports = Model;
module.exports = sequelize;
