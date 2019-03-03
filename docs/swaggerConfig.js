const swaggerJSDoc = require("swagger-jsdoc");

module.exports = () => {
  const swaggerDefinition = {
    info: {
      title: "Service Documentation",
      version: "1.0.0",
      description: "Service and stuff"
    },
    basePath: "/",
    consumes: [
      "application/json"
    ]
  };

  // options for swagger jsdoc
  const options = {
    swaggerDefinition,
    apis: ["./modules/**/*.js", "./docs/parameters.yaml"], // path where API specification are written
  };

  return swaggerJSDoc(options);
};
