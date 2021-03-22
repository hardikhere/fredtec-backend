const express = require("express");
const { addNewFeed, updateFeed, getSchoolFeeds, deleteFeed } = require("../Controllers/Feeds");
const router = express.Router();
const { registerUser, loginUser, updateLastViewedInquiry } = require("../Controllers/User");

router.post("/user/register", registerUser);
router.post("/user/login", loginUser);

router.post("/new-feed", addNewFeed);
router.delete("/delete-feed/:_id", deleteFeed);
router.put("/update-feed", updateFeed);
router.get("/feeds/school/:sid", getSchoolFeeds);
router.get("/inquiryReaded/:uid/:time", updateLastViewedInquiry)
module.exports = router;