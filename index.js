const express = require('express');

const app = express();
const { Client } = require('pg');
const users = require('./routes/users');
const buses = require('./routes/buses');
const trips = require('./routes/trips');
const bookings = require('./routes/bookings');
// const auth = require("./routes/auth");

const client = new Client({
  user: 'postgres',
  password: 'postgres',
  host: 'usanga-pc',
  port: 5432,
  database: 'wayfarer',
});

app.use(express.json());
app.use('/api/v1/users', users);
app.use('/api/v1/trips', trips);
app.use('/api/v1/buses', buses);
app.use('/api/v1/bookings', bookings);
// app.use("/api/auth", auth);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));

client.connect().then(() => console.log('connected to database'));
