const School = require("../Modals/Schools/School");
const { generateSchoolId } = require("../utils/common");
const SendResponse = require("../utils/Responses");



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

//api to search school by name or lacation
// we have 
//query -->string
//type of school-->[String]
//board-->[String]
//classification-->[String]
//fees-->[String]

const searchSchools = async (req, res) => {
    let { limit,
        query,
        board,
        classification,
        fees,
        schoolType,
        skip
    } = req.query;
    let FilterArray = [];

    if (query) {
        query = query.split(",");
        FilterArray = FilterArray.concat([{ schoolName: { "$regex": `${query}`, "$options": "i" } },
        {
            "contactDetails.address": { "$regex": `${query}`, "$options": "i" }
        }])
    }
    if (board) {
        board = board.split(",")
        FilterArray.push({
            board: { "$in": board }
        });
    }
    if (schoolType) {
        schoolType = schoolType.split(",");
        FilterArray.push({
            schoolType: { "$in": schoolType }
        })
    }
    if (classification) {
        classification = classification.split(",");
        FilterArray.push({
            classification: { "$in": classification }
        })
    }
    School.find({
        "$or": FilterArray
    }, "-queries")
        .skip(skip ? parseInt(skip) : 0)
        .limit(limit ? parseInt(limit) : 40)
        .then((docs) => {
            return SendResponse(res, 200, docs, "OK!", docs.length > 0 ? false : true)
        })
};


const addQuery = async (req, res) => {
    const { schoolId } = req.params;
    const { query } = req.body;
    School.findOneAndUpdate({ schoolId }, {
        $push: {
            queries: query
        }
    }, (err, doc) => {
        if (err)
            return SendResponse(res, 500, err, "Error Occured", true);
        if (doc)
            return SendResponse(res, 200, doc, "OK!");
        if (!doc)
            return SendResponse(res, 404, {}, "School Not Found", true);
        return SendResponse(res, 400, {}, err.message, err);
    })
};

const addReview = async (req, res) => {
    const { schoolId, userId } = req.params;
    let { review } = req.body;
    review.by = userId;
    School.findOneAndUpdate({ schoolId }, {
        $push: {
            reviews: review
        }
    }, (err, doc) => {
        if (doc)
            return SendResponse(res, 200, doc, "OK!");
        if (!doc)
            return SendResponse(res, 404, {}, "School Not Found", true);
        return SendResponse(res, 400, {}, err.message, err);
    })
}

module.exports = {
    createSchool,
    updateSchool,
    deleteSchool,
    getSchoolProfiles,
    getSchool,
    searchSchools,
    addQuery,
    addReview
}