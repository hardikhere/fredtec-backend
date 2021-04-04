const SchoolAdmins = require("../Modals/Schools/SchoolAdmin");
const SendResponse = require("../utils/Responses");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtGenerator } = require("../utils/common");

const checkAdmin = async (res, decoded) => {
    const { id } = decoded;
    return await SchoolAdmins.findOne({ _id: id }, "-password", (err, user) => {
        if (user) return user;
        if (err)
            return SendResponse(res, 500, false, err.message, err)
        if (!user)
            return SendResponse(res, 400, false, "User not registered", true);

    });
}

let checkSchoolAdminToken = (req, res, next) => {
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    console.log(token);
    if (!token)
        return SendResponse(res, 403, {}, "Token is Missing", true);

    if (token.startsWith("Bearer "))
        token = token.slice(7, token.length);

    if (token) {
        jwt.verify(token, process.env.JWTSECRET, async (err, decoded) => {
            if (err)
                return SendResponse(res, 400, {}, "Invalid Token!", err);
            else {
                req.decoded = decoded;
                console.log("decoded is ", decoded)
                checkAdmin(res, decoded)
                    .then((checkUser) => {
                        console.log("check user is ", checkUser)
                        if (checkUser)
                            next();
                        else return SendResponse(res, 500, {}, "User Not Available", true);
                    })
                    .catch((error) => {
                        console.log(error.message, error)
                        return SendResponse(res, 500, error, "Token Verification Failed", true);
                    });
            }
        });
    }
};
const registerSchoolAdmin = (req, res) => {
    const errors = [];
    const { email, password } = req.body;

    if (!email)
        errors.push("email is required");
    if (!password)
        errors.push("password is required");
    if (errors.length > 0) {
        return SendResponse(res, 400, {}, "Error!", errors);
    }

    SchoolAdmins.findOne({ email }, (err, doc) => {
        if (doc)
            return SendResponse(res, 400, {}, "User Already Registered!", true);
        var newUser = new SchoolAdmins(req.body);
        const saltRounds = 10;
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            if (err) return SendResponse(res, 400, {}, "Error Occured", err);
            newUser.password = hash;
            newUser.save().then(async (doc) => {
                const token = await jwtGenerator(doc._id);
                doc.password = undefined;
                return SendResponse(res, 200, {
                    user: doc,
                    token
                }, "Success");
            })

        });
    })
};

const loginSchoolAdmin = async (req, res) => {
    const { email, password } = req.body;
    SchoolAdmins.findOne({ email }).then(async (doc) => {
        if (doc) {
            await bcrypt.compare(password, doc.password, async (err, isMatch) => {
                if (isMatch) {
                    const token = await jwtGenerator(doc._id);
                    doc.password = undefined;
                    return SendResponse(res, 200, {
                        user: doc,
                        token
                    }, "Success");
                }
                return SendResponse(res, 400, false, "Incorrect Password", true);
            })
        } else {
            return SendResponse(res, 403, false, "Admin Not Registered", true);
        }
    })
};

const getAdminByToken = async (req, res) => {
    return SendResponse(res, 200, await checkAdmin(res, req.decoded));
}


module.exports = {
    loginSchoolAdmin,
    registerSchoolAdmin,
    checkSchoolAdminToken,
    getAdminByToken
}