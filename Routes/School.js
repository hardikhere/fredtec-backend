const express = require("express");
const { createSchool } = require("../Controllers/Schools");
const router = express.Router();

router.post("/create-school", createSchool);

module.exports = router;