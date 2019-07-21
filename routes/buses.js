const express = require('express');
const { Client } = require('pg');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();
const { validate } = require('../models/bus');

const client = new Client({
  user: 'postgres',
  password: 'postgres',
  host: 'usanga-pc',
  port: 5432,
  database: 'wayfarer',
});

client.connect();

router.post('/', [auth, admin], async (req, res) => {
  const result = validate(req.body);

  if (result.error) {
    res.status(404).json({
      status: 'failure',
      message: 'Invalid request data',
      error: result.error.details[0].message,
    });
  }

  await client.query(
    'insert into bus (bus_id, number_plate, manufacturer, model, year, capacity) values($1, $2, $3, $4, $5, $6)',
    [
      `${req.body.bus_id}`,
      `${req.body.number_plate}`,
      `${req.body.manufacturer}`,
      `${req.body.model}`,
      `${req.body.year}`,
      `${req.body.capacity}`,
    ],
  );
  res.status(200).send({
    status: 'success',
    data: req.body,
  });
});

router.delete('/:id', [auth, admin], async (req, res) => {
  await client.query('delete from bus where id = $1', [`${req.params.id}`]);
  res.send(true);
});

module.exports = router;
