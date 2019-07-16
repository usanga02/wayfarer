const express = require("express");

const router = express.Router();
const { Client } = require("pg");
const { validate } = require("../models/bus");

const client = new Client({
  user: "postgres",
  password: "postgres",
  host: "usanga-pc",
  port: 5432,
  database: "wayfarer"
});

client.connect();

router.get("/", async (req, res) => {
  const result = await client.query("select * from bus");
  res.status(200).send(result.rows);
});

router.post("/", async (req, res) => {
  const result = validate(req.body);

  if (result.error) {
    res.status(404).json({
      status: "failure",
      message: "Invalid request data",
      error: result.error.details[0].message
    });
  }

  await client.query(
    "insert into bus (id, number_plate, manufacturer, model, year, capacity) values($1, $2, $3, $4, $5, $6)",
    [
      `${Math.ceil(Math.random() * 9999)}`,
      `${req.body.number_plate}`,
      `${req.body.manufacturer}`,
      `${req.body.model}`,
      `${req.body.year}`,
      `${req.body.capacity}`
    ]
  );
  res.status(200).send({
    status: "success",
    data: req.body
  });
});

router.put("/:id", async (req, res) => {
  await client.query(
    "update users set name = $1, email = $2, password = $3 where id = $4",
    [
      `${req.body.name}`,
      `${req.body.email}`,
      `${req.body.password}`,
      `${req.params.id}`
    ]
  );
  res.status(200).send({
    status: "success",
    data: []
  });
});

router.delete("/:id", async (req, res) => {
  await client.query("delete from users where id = $1", [`${req.params.id}`]);
  res.send(true);
});

module.exports = router;
