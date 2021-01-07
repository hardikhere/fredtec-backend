const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateSchoolId = (schoolName) => {
    if (typeof schoolName !== "string") return;
    schoolName = schoolName.split(" ")[0];
    schoolName = schoolName.trim();
    return `${schoolName}-${(Date.now()).toString(16)}`;
};

async function jwtGenerator(id) {
  const payload = {
    id
  };
  return await jwt.sign(payload, process.env.JWTSECRET, { expiresIn: '1000d' });
}

module.exports = { generateSchoolId,jwtGenerator }