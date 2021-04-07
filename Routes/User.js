const express = require("express");
const { addNewFeed, updateFeed, getSchoolFeeds, deleteFeed } = require("../Controllers/Feeds");
const router = express.Router();
const { registerUser, loginUser, getUserByToken, checkToken } = require("../Controllers/User");
const basicWrapper = async (req, res, controller) => {
    try {
        return await controller(req, res);
    } catch (err) {
        return SendResponse(res, 500, {}, "Internal Server Error!", err.message);
    }
}
router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get("/user", checkToken,  getUserByToken);
router.post("/new-feed", addNewFeed);
router.delete("/delete-feed/:_id", deleteFeed);
router.put("/update-feed", updateFeed);
router.get("/feeds/school/:sid", getSchoolFeeds);

module.exports = router;