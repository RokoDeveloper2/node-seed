
const config      = require("config");
const compression = require("compression")
const Express     = require("express");
const fs          = require("fs");
const logger      = require("./utils/logger");
const setupSwagger = require("./docs/swaggerConfig");
const cluster     = require("cluster");
const numCPUs     = require("os").cpus().length;
const sequelize   = require("./database/index");

const app         = new Express();
const port        = process.env.PORT || config.get("DefaultPort");

const { NODE_ENV = "" } = process.env;


if (cluster.isMaster && NODE_ENV !== "test") {
  logger.info(`[${config.get("ServiceName")}] - Master ${process.pid} is running`);

  //DB connection.
  sequelize.authenticate()
 .then(() => {
   logger.info("Connection has been established successfully...");
 })
 .catch(err => {
   logger.info("Unable to connect to the database:", err);
 });

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    logger.error(`[${config.get("ServiceName")}] - Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
    logger.info(`[${config.get("ServiceName")}] - Starting a new worker`);
    cluster.fork();
  });

} else {
  app.use(compression());

  global.logger = logger;

  app.get("/ping", (req, res) => {
    res.status(200).send({payload: "pong"});
  });

  if (NODE_ENV !== "production") {
    app.options("/docs", (req, res, next) => { // eslint-disable-line
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
      res.sendStatus(200);
    });
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      next();
    });
    app.get("/docs", (req, res) => {
      if (req.query.token !== "pGxry9ZDLi") return res.sendStatus(404);
      res.setHeader("Content-Type", "application/json");
      res.send(setupSwagger());
    });
  }
  
  fs.readdirSync("./modules")
    .filter(file => (file.indexOf(".") !== 0))
    .forEach((file) => {
      require(`./modules/${file}/${file}.routes.js`)(app); // eslint-disable-line
    });

  app.listen(port, (error) => {
    if (error) {
      logger.error("Error");
    } else {
      logger.info(`[${config.get("ServiceName")}] - Running on port ${port}`);
    }
  });
}

module.exports = app;
