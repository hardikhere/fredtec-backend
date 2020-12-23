const { update } = require("../Modals/Schools/School");
const School = require("../Modals/Schools/School");
const SendResponse = require("../utils/Responses");

const generateSchoolId = (schoolName) => {
    if (typeof schoolName !== "string") return;
    schoolName = schoolName.split(" ")[0];
    schoolName = schoolName.trim();
    return `${schoolName}-${(Date.now()).toString(16)}`;
}


const createSchool = async (req, res) => {
    const { schoolDetails } = req.body;
    schoolDetails.schoolId = generateSchoolId(schoolDetails.schoolName);
    const newSchool = new School(schoolDetails);
    newSchool.save().then((doc) => {
        if (doc)
            return SendResponse(res, 200, doc, "School Created Successfully!");
        else
            return SendResponse(res, 400, {}, "Not Able To Save School Profile!", true);

    }).catch(err => {
        return SendResponse(res, 500, {}, "Internal Server Error!", err);
    })
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
}

const deleteSchool = async (req, res) => {
    School.findOneAndDelete({ schoolId: req.params.schoolId }, (err, doc) => {
        if (err)
            return SendResponse(res, 400, {}, "Can not delete School from DB", true);
        if (!doc)
            return SendResponse(res, 404, {}, "School not found!", true);
        SendResponse(res, 200, doc, "School Successfully Deleted!");
    })
}

module.exports = {
    createSchool,
    updateSchool,
    deleteSchool
}