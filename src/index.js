const express = require("express");
const bodyParser = require("body-parser");

require("./models/User");

const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const isAuth = require("./middlewares/requireAuth");

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

  app.listen(5000, () => console.log("Server running."));
})();
