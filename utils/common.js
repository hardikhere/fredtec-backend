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

const convertSearchQueryToMongo = (search) => {
  const mongoObj = { $or: [] };
  // adding a check for query search 
  if (!!search?.query?.length) {
    mongoObj["$text"] = { $search: search.query }
  }

  delete search.query;
  const obj = Object.keys(search).reduce((acc, curValue) => {
    const keyFilter = search[curValue];
    if (keyFilter.length === 0) return acc;
    let newValue = keyFilter.split(",");
    return { ...acc, [curValue]: newValue };
  }, {});

  Object.keys(obj).forEach(key => {
    mongoObj["$or"].push({ [key]: { $in: obj[key] } })
  })

  return mongoObj
}

module.exports = { generateSchoolId, jwtGenerator, convertSearchQueryToMongo }