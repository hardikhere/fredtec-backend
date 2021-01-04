
//incomplete will refactor it later
const uploadImage = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    const userId = req.decoded.id;
    Logger.debug(userId);
    form.parse(req, (err, fields, file) => {
        Logger.debug(file);
        Logger.debug(file.ProfilePic.path);
        let buf = fs.readFileSync(file.ProfilePic.path);
        Logger.info(buf);
        const filePath = "users/" + userId + "/" + file.ProfilePic.name;
        s3.putObject({
            Bucket: BUCKET_NAME,
            Body: buf,
            Key: filePath,
            ContentType: file.ProfilePic.type,
            ACL: "public-read",
        })
            .promise()
            .then((response) => {
                Logger.debug(`done!`, response);
                let url = s3.getSignedUrl("getObject", {
                    Bucket: BUCKET_NAME,
                    Key: filePath,
                });
                url = url.split("?")[0];
                return ResponseJson(res, 200, true, "Image uploaded!", {
                    url,
                });
            })
            .catch((err) => {
                //handle error
                Logger.error(err);
                return ResponseJson(
                    res,
                    500,
                    false,
                    "Internal server Error",
                    {},
                    { err }
                );
            });
    });
};