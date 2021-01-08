const express = require('express');
const {
	createSchool,
	updateSchool,
	deleteSchool,
	getSchoolProfiles,
	getSchool,
	searchSchools,
	reviewSchool,
} = require('../Controllers/Schools');
const SendResponse = require('../utils/Responses');
const router = express.Router();

const basicWrapper = async (req, res, controller) => {
	try {
		return await controller(req, res);
	} catch (err) {
		return SendResponse(res, 500, {}, 'Internal Server Error!', err.message);
	}
};

router.post('/create-school', (req, res) =>
	basicWrapper(req, res, createSchool)
); //exprerimental
router.post('/update-school/:schoolId', updateSchool);
router.delete('/delete-school/:schoolId', deleteSchool);
router.get('/schools', getSchoolProfiles);
router.post('/school/review', reviewSchool);
router.get('/school/:schoolId', getSchool);
router.get('/search', (req, res) => basicWrapper(req, res, searchSchools));
module.exports = router;
