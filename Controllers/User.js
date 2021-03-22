const User = require("../Modals/User/UserSchema");
const SendResponse = require("../utils/Responses");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtGenerator } = require("../utils/common");

const checkUser = async (res, decoded) => {
    const { id } = decoded;
    await Users.findOne({ uid: id }, (err, user) => {
        if (err)
            return SendResponse(res, 500, false, err.message, err)
        if (!user)
            return SendResponse(res, 400, false, "User not registered", true);
        return true;
    });
}

let checkToken = (req, res, next) => {
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    console.log(token);
    if (!token)
        return SendResponse(res, 403, {}, "Token is Missing", true);

    if (token.startsWith("Bearer "))
        token = token.slice(7, token.length);

    if (token) {
        jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
            if (err)
                return SendResponse(res, 400, {}, "Invalid Token!", err);
            else {
                req.decoded = decoded;
                checkUser(res, decoded)
                    .then((res) => {
                        if (res === true)
                            next();
                        else return res;
                    })
                    .catch((error) => {
                        return SendResponse(res, 500, false, "Token Verification Failed", true);
                    });
            }
        });
    }
};

const registerUser = (req, res) => {
    const errors = [];
    const { email, password } = req.body;

    if (!email)
        errors.push("email is required");
    if (!password)
        errors.push("password is required");
    if (errors.length > 0) {
        return SendResponse(res, 400, {}, "Error!", errors);
    }

    User.findOne({ email }, (err, doc) => {
        if (doc)
            return SendResponse(res, 400, {}, "User Already Registered!", true);
        var newUser = new User(req.body);
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

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }).then(async (doc) => {
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
            return SendResponse(res, 403, false, "User Not Registered", true);
        }
    })
};

const updateLastViewedInquiry = (req, res) => {
    const { uid, time } = req.params;
    User.updateOne({ _id: uid }, {
        lastViewedInquiry: time
    }, (err, raw) => {
        if (err)
            return SendResponse(res, 400, {}, "Failed to update", true);
        return SendResponse(res, 200, raw, "updated")
    })
}

module.exports = {
    registerUser,
    checkUser,
    checkToken,
    loginUser,
    updateLastViewedInquiry
}