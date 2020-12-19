const School = require("../Modals/Schools/School");

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
            return res.json({
                success: true,
                data: doc,
                message: "School Saved Successfully!"
            })
        else {
            return res.json({
                success: false,
                data: null,
                message: "Could not save Data in DB"
            })
        }
    })

};

module.exports = {
    createSchool
}