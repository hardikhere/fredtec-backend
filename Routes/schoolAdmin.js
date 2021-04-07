const express = require("express");
const { registerSchoolAdmin,
    loginSchoolAdmin,
    getAdminByToken,
    checkSchoolAdminToken,
    updateLastViewedInquiry } = require("../Controllers/schoolAdmin");
const router = express.Router();

const basicWrapper = async (req, res, controller) => {
    try {
        return await controller(req, res);
    } catch (err) {
        return SendResponse(res, 500, {}, "Internal Server Error!", err.message);
    }
};

router.put("/lastquery-view/:id/:time", (req, res) => basicWrapper(req, res, updateLastViewedInquiry));
router.post("/schoolAdmin/register", (req, res) => basicWrapper(req, res, registerSchoolAdmin));
router.post("/schoolAdmin/login", (req, res) => basicWrapper(req, res, loginSchoolAdmin));
router.get("/schoolAdmin", checkSchoolAdminToken, (req, res) => basicWrapper(req, res, getAdminByToken))
module.exports = router;
