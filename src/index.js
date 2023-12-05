const app = require("./app");
const sequelize = require("./models");

async function assertDatabaseConnectionOk() {
  console.log("Checking database connection...");
  try {
    await sequelize.authenticate();
    console.log("Database connection OK!");
  } catch (error) {
    console.log("Unable to connect to the database:");
    console.log(error.message);
    process.exit(1);
  }
}

async function main() {
  await assertDatabaseConnectionOk();
  app.run();
}
main();
