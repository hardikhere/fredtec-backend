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
    const { userDetails } = req.body;
    const errors = [];
    const { email, password, userName } = userDetails;
    if (!userDetails)
        errors.push("userDetails Object is required");
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
        var newUser = new User(userDetails);
        const saltRounds = 10;
        bcrypt.hash(userDetails.password, saltRounds, function (err, hash) {
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
    //will do later
};

module.exports = {
    registerUser,
    checkUser,
    checkToken
}