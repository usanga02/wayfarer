const express = require('express');

const router = express.Router();
const { Client } = require('pg');
const { validate } = require('../models/booking');

const client = new Client({
  user: 'postgres',
  password: 'postgres',
  host: 'usanga-pc',
  port: 5432,
  database: 'wayfarer',
});

client.connect();

router.get('/', async (req, res) => {
  try {
    const result = await client.query('select * from booking');
    res.status(200).send(result.rows);
  } catch (e) {
    console.log(e);
  }
});

router.post('/', async (req, res) => {
  const result = validate(req.body);

  if (result.error) {
    res.status(404).json({
      status: 'failure',
      message: 'Invalid request data',
      error: result.error.details[0].message,
    });
  }

  try {
    await client.query(
      'insert into booking (id, trip_id, user_id, created_on) values($1, $2, $3, $4)',
      [
        `${Math.ceil(Math.random() * 9999)}`,
        `${req.body.trip_id}`,
        `${req.body.user_id}`,
        `${req.body.created_on}`,
      ],
    );
    res.status(200).json({
      status: 'success',
      message: 'User created successfully',
      data: req.body,
    });
  } catch (e) {
    console.log(e);
  }
});

router.put('/:id', async (req, res) => {
  try {
    await client.query(
      'update users set name = $1, email = $2, password = $3 where id = $4',
      [
        `${req.body.name}`,
        `${req.body.email}`,
        `${req.body.password}`,
        `${req.params.id}`,
      ],
    );
    res.status(200).send({
      status: 'success',
      data: [],
    });
  } catch (e) {
    res.status(404).send({
      status: 'failure',
      error: e,
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await client.query('delete from users where id = $1', [`${req.params.id}`]);
    res.send(true);
  } catch (e) {
    console.log(e);
    res.send(false);
  }
});

module.exports = router;
