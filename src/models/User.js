const mongoose = require("mongoose");
const argon2 = require("argon2");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const hashedPassword = await argon2.hash(user.password);
  user.password = hashedPassword;
  next();
});

userSchema.methods.comparePassword = function (
  candidatePassword
) {
  const user = this;
  return new Promise(async (resolve, reject) => {
    try {
      if (
        await argon2.verify(
          user.password,
          candidatePassword
        )
      ) {
        // password match
        return resolve(true);
      } else {
        // password did not match
        return reject(false);
      }
    } catch (err) {
      // internal failure
      return reject(err);
    }
  });
};

mongoose.model("User", userSchema);
