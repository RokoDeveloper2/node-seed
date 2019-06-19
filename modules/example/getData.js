const NotFound = require("../../utils/exceptions/NotFound");
//const BadGateway = require("../../utils/exceptions/BadGateway");
const Joi = require("joi");

async function Database() {

}

module.exports.endpoint = async (req) => {

  const entity = await Database(req.params.id);
  if (!entity) {
    throw new NotFound(`Entity with id ${req.params.id} not found.`);
  }
  return { status: 200 };
};

module.exports.validations = {
  params: {
    id: Joi.number().required()
  }
};
