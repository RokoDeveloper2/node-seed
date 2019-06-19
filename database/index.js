const Sequelize = require("sequelize");
const config = require("config");

const sequelize = new Sequelize(config.get("database.name"), config.get("database.username"), config.get("database.password"), {
    host: config.get("database.host"),
    dialect: "mysql"
},
    {
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);


module.exports = sequelize;