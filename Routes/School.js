const express = require("express");
const { uploadImage } = require("../Controllers/Admin");
const { getLatestFeeds } = require("../Controllers/Feeds");
const { createSchool,
    updateSchool,
    deleteSchool,
    getSchoolProfiles,
    getSchool,
    searchSchools,
    addQuery,
    addReview,
    createdAnnouncements } = require("../Controllers/Schools");
const SendResponse = require("../utils/Responses");
const router = express.Router();

const basicWrapper = async (req, res, controller) => {
    try {
        return await controller(req, res);
    } catch (err) {
        return SendResponse(res, 500, {}, "Internal Server Error!", err.message);
    }
}


router.post("/create-school", (req, res) => basicWrapper(req, res, createSchool)); //exprerimental
router.post("/update-school/:schoolId", updateSchool);
router.delete("/delete-school/:schoolId", deleteSchool);
router.get("/schools", getSchoolProfiles);
router.get("/school/:schoolId", getSchool);
router.get("/search", (req, res) => basicWrapper(req, res, searchSchools));
router.post("/query/:schoolId", (req, res) => basicWrapper(req, res, addQuery));

router.post("/review/:schoolId/:userId", addReview);
router.post("/upload-image", uploadImage);
router.post("/create-announcement/:schoolId", (req, res) => basicWrapper(req, res, createdAnnouncements))

router.get("/feeds", (req, res) => basicWrapper(req, res, getLatestFeeds));
module.exports = router;