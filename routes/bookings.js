const express = require('express');
const { Client } = require('pg');
const auth = require('../middleware/auth');

const router = express.Router();
const { validate } = require('../models/booking');

const client = new Client({
  user: 'postgres',
  password: 'postgres',
  host: 'usanga-pc',
  port: 5432,
  database: 'wayfarer',
});

client.connect();

router.get('/', [auth], async (req, res) => {
  let booking;
  if (req.user.is_admin) {
    booking = await client.query('select * from booking');
  } else {
    booking = await client.query('select * from booking where user_id = $1', [
      `${req.user.user_id}`,
    ]);
  }
  res.status(200).send(booking.rows);
});

router.post('/', auth, async (req, res) => {
  const result = validate(req.body);

  if (result.error) {
    res.status(404).json({
      status: 'failure',
      message: 'Invalid request data',
      error: result.error.details[0].message,
    });
  }
  console.log(req.user.user_id);
  await client.query(
    'insert into booking (user_id, booking_id, trip_id, created_on) values($1, $2, $3, $4)',
    [
      `${req.user.user_id}`,
      `${req.body.booking_id}`,
      `${req.body.trip_id}`,
      `${req.body.created_on}`,
    ],
  );
  res.status(200).json({
    status: 'success',
    message: 'Booking created successfully',
    data: req.body,
  });
});

router.put('/', auth, async (req, res) => {
  try {
    await client.query(
      'update users set booking_id = $1, trip_id = $2 created_on = $3 where user_id = $4',
      [
        `${req.body.booking_id}`,
        `${req.body.trip_id}`,
        `${req.body.created_on}`,
        `${req.user.user_id}`,
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

router.delete('/:id', auth, async (req, res) => {
  try {
    await client.query('delete from users where booking_id = $1', [
      `${req.params.id}`,
    ]);
    res.send(true);
  } catch (e) {
    console.log(e);
    res.send(false);
  }
});

module.exports = router;
