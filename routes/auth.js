const jwt = require('jsonwebtoken');
const express = require('express');
const config = require('config');

const router = express.Router();
const Joi = require('joi');
const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  password: 'postgres',
  host: 'usanga-pc',
  port: 5432,
  database: 'wayfarer',
});

client.connect();

function validate(user) {
  const userSchema = {
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required(),
  };

  return Joi.validate(user, userSchema);
}

router.post('/', async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    res.status(400).json({
      status: 'failure',
      message: 'Invalid request data',
      error: error.details[0].message,
    });
  }

  const user = await client.query('select * from users where email = $1', [
    `${req.body.email}`,
  ]);
  const password = await client.query(
    'select * from users where password = $1',
    [`${req.body.password}`],
  );

  if (!(user || password).rows[0]) {
    res.status(400).json({
      status: 'failure',
      error: 'invalid email or password',
    });
  }

  const token = jwt.sign(
    {
      user_id: user.rows[0].user_id,
      email: req.body.email,
      is_admin: user.rows[0].is_admin,
    },
    config.get('jwtPrivateKey'),
  );

  res.status(200).json({
    status: 'success',
    data: {
      user_id: user.rows[0].user_id,
      is_admin: user.rows[0].is_admin,
      token,
    },
  });
});

module.exports = router;
