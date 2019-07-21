const Joi = require('joi');

function validateUser(user) {
  const userSchema = {
    first_name: Joi.string()
      .required()
      .min(3)
      .max(255),
    last_name: Joi.string()
      .required()
      .min(3)
      .max(255),
    email: Joi.string()
      .email()
      .required(),
    is_admin: Joi.boolean().required(),
    password: Joi.string().required(),
  };

  return Joi.validate(user, userSchema);
}

module.exports.validate = validateUser;
