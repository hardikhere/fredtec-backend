const generateSchoolId = (schoolName) => {
    if (typeof schoolName !== "string") return;
    schoolName = schoolName.split(" ")[0];
    schoolName = schoolName.trim();
    return `${schoolName}-${(Date.now()).toString(16)}`;
};
module.exports = { generateSchoolId }