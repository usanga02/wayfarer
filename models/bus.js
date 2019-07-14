const Joi = require('joi');

function validateUser(user) {
  const userSchema = {
    number_plate: Joi.string()
      .required()
      .min(7)
      .max(255),
    manufacturer: Joi.string()
      .required()
      .min(3)
      .max(255),
    model: Joi.string().required(),
    year: Joi.date(),
    capacity: Joi.number().required(),
  };

  return Joi.validate(user, userSchema);
}

module.exports.validate = validateUser;
