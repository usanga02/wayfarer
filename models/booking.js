const Joi = require('joi');

function validateUser(user) {
  const userSchema = {
    trip_id: Joi.number().required(),
    user_id: Joi.number().required(),
    created_on: Joi.date().required(),
  };

  return Joi.validate(user, userSchema);
}

module.exports.validate = validateUser;
