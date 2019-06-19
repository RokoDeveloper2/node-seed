const winston = require("winston");
let logger;

  logger = winston.createLogger({
    transports: [
      new (winston.transports.Console)()
    ],
    exitOnError: false
  });

module.exports = logger;
