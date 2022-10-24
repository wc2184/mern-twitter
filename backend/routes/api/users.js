const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = mongoose.model("User");

/* GET users listing. */
router.get("/", function (req, res, next) {
  // res.send("Respond wdissth a resource");
  res.json({
    message: "GET /api/users",
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
  }
});

module.exports = router;
