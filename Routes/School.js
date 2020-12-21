const express = require("express");
const { createSchool, updateSchool } = require("../Controllers/Schools");
const router = express.Router();

router.post("/create-school", createSchool);
router.post("/update-school/:schoolId", updateSchool);

module.exports = router;