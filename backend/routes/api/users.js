const express = require("express");
const passport = require("passport");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = mongoose.model("User");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  // res.send("Respond wdissth a resource");
  let users = await User.find();
  res.json({
    user: users,
  });
});

router.post("/register", async (req, res, next) => {
  // let user = await User.findOne({ username: req.body.username }); // just one condition
  let user = await User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });

  if (user) {
    // if already exists
    const err = new Error("Validation Error");
    err.statusCode = 400;
    const errors = {};
    if (user.email === req.body.email) errors.email = "Email already exists";
    if (user.username === req.body.username)
      errors.username = "Username already exists";
    err.errors = errors;
    next(err);
    return;
  }

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
  });

  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(req.body.password, salt, async (err, hashedPassword) => {
      if (err) throw err;
      try {
        newUser.hashedPassword = hashedPassword;
        const user = await newUser.save();
        return res.json({ user });
      } catch (err) {
        next(err);
      }
    });
  });
});

router.post("/login", async (req, res, next) => {
  passport.authenticate("local", async function (err, user) {
    if (err) return next(err);
    if (!user) {
      const err = new Error("Invalid credentials");
      err.statusCode = 400;
      err.errors = { email: "Invalid credentials" };
      return next(err);
    }
    return res.json({ user });
  })(req, res, next);
});

module.exports = router;
