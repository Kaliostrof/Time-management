const express = require("express");

const router = express.Router({ mergeParams: true });

router.use("/", require("./auth"));
router.use("/projects", require("./projects"));
router.use("/users", require("./user"));

module.exports = router;
