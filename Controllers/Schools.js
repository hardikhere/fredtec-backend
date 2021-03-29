const Query = require("../Modals/Schools/QuerySchema");
const School = require("../Modals/Schools/School");
const { generateSchoolId } = require("../utils/common");
const { FREE_CREDITS, QueryUnlockCredits } = require("../utils/constants");
const SendResponse = require("../utils/Responses");


const createSchool = async (req, res) => {
    const { schoolDetails } = req.body;
    schoolDetails.schoolId = generateSchoolId(schoolDetails.schoolName);
    const newSchool = new School(schoolDetails);
    newSchool.save().then((doc) => {
        updateCreditsInternally(schoolDetails.schoolId, FREE_CREDITS.firstTime)
            .then(isDone => {
                if (isDone) {
                    doc.creditsAdded = FREE_CREDITS.firstTime;
                    if (doc)
                        return SendResponse(res, 200, doc, "School Created Successfully And Free Credits Added!");
                    else
                        return SendResponse(res, 400, {}, "Not Able To Save School Profile!", true);
                }
                if (doc)
                    return SendResponse(res, 200, doc, "School Created Successfully!");
                else
                    return SendResponse(res, 400, {}, "Not Able To Save School Profile!", true);
            })

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
        skip,
        sortBy
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
    School.find(FilterArray.length > 0 ? {
        "$or": FilterArray
    } : {}, "-queries")
        .skip(skip ? parseInt(skip) : 0)
        .limit(limit ? parseInt(limit) : 40)
        .then((docs) => {
            return SendResponse(res, 200, docs, "OK!", docs.length > 0 ? false : true)
        })
};


const addQuery = async (req, res) => {
    const { schoolId } = req.params;
    const { query } = req.body;
    const newQuery = new Query(query);
    newQuery.save().then((doc) => {
        School.findOneAndUpdate({ schoolId }, {
            $push: {
                queries: doc._id
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
    })
};

const getQueryBySchoolId = async (req, res) => {
    School.findOne({ schoolId: req.params.schoolId }, "schoolName schoolId")
        .populate("queries")
        .then((doc) => {
            if (!doc)
                return SendResponse(res, 404, {}, "School Not Found", true);
            return SendResponse(res, 200, doc)
        })
}

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
};

const createdAnnouncements = (req, res) => {
    const { schoolId } = req.params;
    const { announcement } = req.body;
    School.updateOne({ schoolId }, {
        $push: {
            announcements: announcement
        }
    }, (err, raw) => {
        if (err)
            return SendResponse(res, 400, {}, "Failed to create announcement", true);
        return SendResponse(res, 200, raw, "Announcement Created!")
    })

};

const updateCredit = async (req, res) => {
    const { credits, codeWord } = req.body;
    const { schoolId } = req.param;
    School.updateOne({ schoolId }, {
        "$inc": {
            "credits": credits
        }
    }, (err, raw) => {
        if (err)
            return SendResponse(res, 400, {}, "Failed to update credit points!", true);
        return SendResponse(res, 200, raw, "Credit Points Added Successfully!")
    })
};

const updateCreditsInternally = async (sid, credits) => {
    School.updateOne({ schoolId: sid }, {
        "$inc": {
            "credits": credits
        }
    }, (err, raw) => {
        if (err)
            return false
        return true;
    })
};

const checkIfQuerylocked = async (qid) => {
    Query.findById({ _id: qid }, (err, doc) => {
        if (doc.isUnlocked) return true;
        return false
    })
}

const unlockQuery = async (req, res) => {
    const { qid, sid } = req.params;
    checkIfQuerylocked(qid).then(check => {
        if (check) {
            updateCreditsInternally(sid, -QueryUnlockCredits).then(status => {
                Query.updateOne({ _id: qid }, {
                    $set: {
                        "isUnlocked": true
                    }
                }, (err, raw) => {
                    if (err)
                        return SendResponse(res, 400, {}, "Failed to Unlock Query", true);
                    return SendResponse(res, 200, raw, "Unlocked Successfully!")
                })
            })
        }
        else return SendResponse(res, 400, {}, "Already Unlocked", true);
    })
};

const markContacted = async (req, res) => {
    const { qid, flag } = req.params;
    const change = flag == 1 ? true : false;
    Query.updateOne({ _id: qid }, {
        $set: {
            "hasContacted": change
        }
    }, (err, raw) => {
        if (err)
            return SendResponse(res, 400, {}, "Failed to Marked Contacted", true);
        return SendResponse(res, 200, raw, "Marked Contacted Successfully!")
    })
};

module.exports = {
    createSchool,
    updateSchool,
    deleteSchool,
    getSchoolProfiles,
    getSchool,
    searchSchools,
    addQuery,
    getQueryBySchoolId,
    addReview,
    createdAnnouncements,
    updateCredit,
    updateCreditsInternally,
    unlockQuery,
    markContacted
}