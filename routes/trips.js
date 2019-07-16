const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();
const { Client } = require("pg");
const { validate } = require("../models/trip");

const client = new Client({
  user: "postgres",
  password: "postgres",
  host: "usanga-pc",
  port: 5432,
  database: "wayfarer"
});

client.connect();

router.get("/", async (req, res, next) => {
  const result = await client.query("select * from trip");
  res.status(200).send(result.rows);
});

router.post("/", auth, async (req, res) => {
  const result = validate(req.body);

  if (result.error) {
    res.status(404).json({
      status: "failure",
      message: "Invalid request data",
      error: result.error.details[0].message
    });
  }

  trip_id = Math.ceil(Math.random() * 9999);
  await client.query(
    "insert into trip (id, bus_id, origin, destination, trip_date, fare, status) values($1, $2, $3, $4, $5, $6, $7)",
    [
      `${trip_id}`,
      `${req.body.bus_id}`,
      `${req.body.origin}`,
      `${req.body.destination}`,
      `${req.body.trip_date}`,
      `${req.body.fare}`,
      `${req.body.status}`
    ]
  );
  res.status(200).send({
    status: "success",
    data: {
      trip_id: trip_id,
      bus_id: req.body.bus_id,
      origin: req.body.origin,
      destination: req.body.destination,
      trip_date: req.body.trip_date,
      fare: req.body.fare
    }
  });
});

router.delete("/:id", [auth, admin], async (req, res) => {
  await client.query("delete from users where id = $1", [`${req.params.id}`]);
  res.send(true);
});

module.exports = router;
