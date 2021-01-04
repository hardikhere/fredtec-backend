const School = require("../Modals/Schools/School");
const SendResponse = require("../utils/Responses");

const generateSchoolId = (schoolName) => {
    if (typeof schoolName !== "string") return;
    schoolName = schoolName.split(" ")[0];
    schoolName = schoolName.trim();
    return `${schoolName}-${(Date.now()).toString(16)}`;
};


const createSchool = async (req, res) => {
    const { schoolDetails } = req.body;
    schoolDetails.schoolId = generateSchoolId(schoolDetails.schoolName);
    const newSchool = new School(schoolDetails);
    newSchool.save().then((doc) => {
        if (doc)
            return SendResponse(res, 200, doc, "School Created Successfully!");
        else
            return SendResponse(res, 400, {}, "Not Able To Save School Profile!", true);

    });
};


const updateSchool = async (req, res) => {
    const { updateDetails } = req.body;
    if (!updateDetails)
        return SendResponse(res, 400, {}, "updateDetails object is required!", true);
    School.findOneAndUpdate({ schoolId: req.params.schoolId }, updateDetails, (err, doc) => {
        if (err)
            return SendResponse(res, 400, {}, "Error Occured", err);

        if (!doc)
            return SendResponse(res, 404, {}, "School Not Found!", true);

        return SendResponse(res, 200, doc, "Successfully Updated");
    })
};

const deleteSchool = async (req, res) => {
    School.findOneAndDelete({ schoolId: req.params.schoolId }, (err, doc) => {
        if (err)
            return SendResponse(res, 400, {}, "Can not delete School from DB", true);
        if (!doc)
            return SendResponse(res, 404, {}, "School not found!", true);
        SendResponse(res, 200, doc, "School Successfully Deleted!");
    })
};

//unfiltered API to fetch Schools Paginated
const getSchoolProfiles = async (req, res) => {

    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    if (limit > 20) {
        return SendResponse(res, 400, {}, "Maximum value of limit is 20", true);
    }
    try {
        School.find({}, "-createdAt -updatedAt -__v -_id")
            .limit(limit)
            .skip(skip)
            .then(docs => {
                let toSend = {
                    results: docs,
                    nextSkip: docs.length < limit ? null : skip + limit
                };
                return SendResponse(res, 200, toSend, "Fetched!");
            })

    } catch (err) {
        return SendResponse(res, 500, {}, "Internal Server Error!");
    }
};

//api to get single populates school profile
const getSchool = async (req, res) => {
    const schoolId = req.params.schoolId;
    if (!schoolId)
        return SendResponse(res, 400, {}, "id is required!", true);
    School.findOne({ schoolId }).then(doc => {
        return SendResponse(res, 200, doc, "OK");
    });
};

module.exports = {
    createSchool,
    updateSchool,
    deleteSchool,
    getSchoolProfiles,
    getSchool
}