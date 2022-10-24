const express = require("express");
const { isProduction } = require("../../config/keys");
const router = express.Router();

/* GET users listing. */
if (!isProduction) {
  router.get("/restore", function (req, res) {
    const csrfToken = req.csrfToken();
    res.status(200).json({
      "CSRF-Token": csrfToken,
    });
  });
}
module.exports = router;
