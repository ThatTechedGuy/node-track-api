const express = require("express");
const bodyParser = require("body-parser");
// Making sure the UserSchema is executed atleast once
require("./models/User");
// Making sure the TrackSchema is executed atleast once
require("./models/Track");

const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const isAuth = require("./middlewares/requireAuth");
const tracks = require("./routes/trackRoutes");

(async () => {
  const app = express();

  app.use(bodyParser.json());

  mongoose.connect(
    "mongodb://mongo:27017/docker-node-mongo",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }
  );

  mongoose.connection.on("connected", () =>
    console.log("Connected to mongo instance")
  );
  mongoose.connection.on("error", (err) =>
    console.log("Failed to connect to mongo instance", err)
  );

  app.get("/", isAuth, (req, res) =>
    res.send(`Your email: ${req.user.email}`)
  );

  app.use(authRoutes);

  app.use(tracks);

  app.listen(5000, () => console.log("Server running."));
})();
