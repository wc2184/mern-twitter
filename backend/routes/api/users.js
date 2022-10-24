const express = require("express");
const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  // res.send("Respond wdissth a resource");
  res.json({
    message: "GET /api/users",
  });
});

module.exports = router;
