const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    console.log("No token. Not logged in/ signed up");

    return res
      .status(401)
      .send({ error: "You must be logged in" });
  }

  const token = authorization.replace("Bearer", '').trim();
  jwt.verify(
    token,
    "MY_SECRET_KEY",
    async (err, payload) => {
      console.log("Error while verifying key");
      if (!payload)
        return res
          .status(401)
          .send({ error: "You must be logged in" });

      const { userId } = payload;

      const user = await User.findById(userId);
      req.user = user;
      next();
    }
  );
};
