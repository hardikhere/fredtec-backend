const express = require("express");
const { createSchool, updateSchool, deleteSchool, getSchoolProfiles } = require("../Controllers/Schools");
const router = express.Router();

router.post("/create-school", createSchool);
router.post("/update-school/:schoolId", updateSchool);
router.delete("/delete-school/:schoolId", deleteSchool);
router.get("/schools", getSchoolProfiles);

module.exports = router;