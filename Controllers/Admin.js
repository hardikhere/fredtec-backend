const { AWSconfig } = require("../utils/constants");
const SendResponse = require("../utils/Responses");
const formidable = require("formidable");
const { s3, BUCKET_NAME } = AWSconfig;
const fs = require("fs");


const uploadImage = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
   // const userId = req.decoded.id;
    form.parse(req, (err, fields, file) => {
        let buf = fs.readFileSync(file.pic.path);
        const filePath = "schools/"  + "demo/" + file.pic.name;
        s3.putObject({
            Bucket: BUCKET_NAME,
            Body: buf,
            Key: filePath,
            ContentType: file.pic.type,
            ACL: "public-read",
        })
            .promise()
            .then((response) => {
                let url = s3.getSignedUrl("getObject", {
                    Bucket: BUCKET_NAME,
                    Key: filePath,
                });
                url = url.split("?")[0];
                return SendResponse(res, 200, { url }, "Image Uploaded!");
            })
            .catch((err) => {
                //handle error
                return SendResponse(res, 500, {}, "Internal Server Error", err);
            });
    });
};

module.exports = {
    uploadImage
}