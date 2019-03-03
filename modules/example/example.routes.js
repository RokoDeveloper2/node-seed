const getPow   = require("./getPow");
const getHello = require("./getHello");
const getData = require("./getData");
const endpoint = require("../../middlewares/endpoint");

const validator = require("../../middlewares/validator");

module.exports = function (app) {
  const { NODE_ENV = "" } = process.env;
  if (NODE_ENV.toLowerCase() !== "production") {
    app.get("/pow/:num", validator(getPow.validations), endpoint(getPow.endpoint));
    app.get("/hello", endpoint(getHello.endpoint));
    app.get("/getData/:id", validator(getData.validations), endpoint(getData.endpoint));
  }
};
