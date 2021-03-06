const config = require('config');
const jwt = require('jsonwebtoken');
const express = require('express');

const router = express.Router();
const { Client } = require('pg');
const auth = require('../middleware/auth');
const { validate } = require('../models/user');

const client = new Client({
  user: 'postgres',
  password: 'postgres',
  host: 'usanga-pc',
  port: 5432,
  database: 'wayfarer',
});
client.connect();

router.get('/me', auth, async (req, res) => {
  const user = await client.query(
    'select first_name, last_name, user_id, email, is_admin from users where user_id = $1',
    [`${req.user.user_id}`],
  );
  res.status(200).send({
    data: user.rows,
  });
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    res.status(400).json({
      status: 'failure',
      message: 'Invalid request data',
      error: error.details[0].message,
    });
  }

  const { rows } = await client.query('select * from users where email = $1', [
    `${req.body.email}`,
  ]);
  if (rows[0]) res.status(400).send('User already registered');

  const user_id = Math.ceil(Math.random() * 9999);
  await client.query(
    'insert into users (user_id, first_name, last_name, email, password, is_admin) values($1, $2, $3, $4, $5, $6)',
    [
      `${user_id}`,
      `${req.body.first_name}`,
      `${req.body.last_name}`,
      `${req.body.email}`,
      `${req.body.password}`,
      `${req.body.is_admin}`,
    ],
  );

  const token = jwt.sign(
    { user_id, email: req.body.email, is_admin: req.body.is_admin },
    config.get('jwtPrivateKey'),
  );

  res
    .header('x-auth-token', token)
    .status(200)
    .json({
      status: 'success',
      message: 'User created successfully',
      data: {
        user_id,
        is_admin: req.body.is_admin,
        token,
      },
    });
});

module.exports = router;
