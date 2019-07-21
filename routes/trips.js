const express = require('express');
const { Client } = require('pg');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();
const { validate } = require('../models/trip');

const client = new Client({
  user: 'postgres',
  password: 'postgres',
  host: 'usanga-pc',
  port: 5432,
  database: 'wayfarer',
});

client.connect();

router.get('/', [auth], async (req, res) => {
  const trip = await client.query('select * from trip');
  res.status(200).send(trip.rows);
});

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
    'insert into trip (trip_id, bus_id, origin, destination, trip_date, fare, status) values($1, $2, $3, $4, $5, $6, $7)',
    [
      `${req.body.trip_id}`,
      `${req.body.bus_id}`,
      `${req.body.origin}`,
      `${req.body.destination}`,
      `${req.body.trip_date}`,
      `${req.body.fare}`,
      `${req.body.status}`,
    ],
  );

  res.status(200).send({
    status: 'success',
    data: req.body,
  });
});

router.delete('/:id', [auth, admin], async (req, res) => {
  await client.query('delete from users where id = $1', [`${req.params.id}`]);
  res.send(true);
});

module.exports = router;
