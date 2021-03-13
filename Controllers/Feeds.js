const Feeds = require("../Modals/Feeds/FeedsSchema");
const SendResponse = require("../utils/Responses");

const addNewFeed = (req, res) => {
    const { title, content, imageUrls, sid } = req.body;
    const newFeed = new Feeds({ title, content, imageUrls, sid });
    newFeed.save().then((doc) => {
        if (doc) {
            return SendResponse(res, 200, doc, "Feed Created Successfully");
        }
        else {
            return SendResponse(res, 500, {}, "Feed Not Created", true);
        }
    })
};

const deleteFeed = (req, res) => {
    const { _id } = req.params;
    Feeds.deleteOne({ _id }, (err) => {
        if (!err) return SendResponse(res, 200, {}, "Deleted")
        return SendResponse(res, 400, err, "Could not Delete the feed", true)
    })
}

const getSchoolFeeds = (req, res) => {
    const { sid } = req.params;
    Feeds.find({ sid }).sort({"createdAt": -1})
    .then((docs) => {
        return SendResponse(res, 200, docs);
    })
}

const updateFeed = (req, res) => {
    const { _id, title, content, imageUrls } = req.body;
    Feeds.updateOne({ _id }, { title, content, imageUrls }, (err, raw) => {
        if (err) {
            SendResponse(res, 400, {}, "Error while updating Feed", true);
        }
        else return SendResponse(res, 200, raw, "Updated");
    })

}

module.exports = {
    addNewFeed,
    deleteFeed,
    getSchoolFeeds,
    updateFeed
}