const SchoolAdmins = require("../Modals/Schools/SchoolAdmin");
const SendResponse = require("../utils/Responses");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtGenerator } = require("../utils/common");

const checkAdmin = async (res, decoded) => {
    const { id } = decoded;
    const user = await SchoolAdmins.findOne({ _id: id }, "-password")
        .populate({
            path: "schoolDetails",
            select: "-_id"
        })
        .exec();
    console.log(user);
    return user;
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
                console.log("decoded is ", decoded);
                next();
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

const getAdminByToken = async (req, res, user) => {
    const { id } = req.decoded;
    SchoolAdmins.findOne({ _id: id }, "-password")
        .populate("schoolDetails")
        .exec((err, user) => {
            if (err)
                return SendResponse(res, 500, err, "Server Error", true);
            var toSend = user.toObject();
            toSend.schoolDetails = user.schoolDetails[0]
            return SendResponse(res, 200, toSend)
        });
};

const updateLastViewedInquiry = (req, res) => {
    const { id, time } = req.params;
    SchoolAdmins.findOneAndUpdate({ _id: id }, {
        $set: {
            lastViewedInquiry: time
        }
    }, (err, raw) => {
        if (err)
            return SendResponse(res, 400, {}, "Failed to update", true);
        return SendResponse(res, 200, raw, "updated")
    })
};


module.exports = {
    loginSchoolAdmin,
    registerSchoolAdmin,
    checkSchoolAdminToken,
    getAdminByToken,
    updateLastViewedInquiry
}