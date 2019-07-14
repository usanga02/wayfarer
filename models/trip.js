const Joi = require('joi');

function validateUser(user) {
  const userSchema = {
    bus_id: Joi.number().required(),
    origin: Joi.string()
      .required()
      .min(3)
      .max(255),
    destination: Joi.string().required(),
    trip_date: Joi.date(),
    fare: Joi.number(),
    status: Joi.number(),
  };

  return Joi.validate(user, userSchema);
}

module.exports.validate = validateUser;
