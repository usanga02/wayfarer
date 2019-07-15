require("express-async-errors");
const express = require("express");
const app = express();
const config = require("config");
const { Client } = require("pg");
const error = require("./middleware/error");
const users = require("./routes/users");
const auth = require("./routes/auth");
const buses = require("./routes/buses");
const trips = require("./routes/trips");
const bookings = require("./routes/bookings");

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

const client = new Client({
  user: "postgres",
  password: "postgres",
  host: "usanga-pc",
  port: 5432,
  database: "wayfarer"
});

app.use(express.json());
app.use("/api/v1/users/signup", users);
app.use("/api/v1/trips", trips);
app.use("/api/v1/buses", buses);
app.use("/api/v1/bookings", bookings);
app.use("/api/v1/auth/signin", auth);
app.use(error);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));

client
  .connect()
  .then(() => console.log("connected to database"))
  .catch(e => console.log(e));
