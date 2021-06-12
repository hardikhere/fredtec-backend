const AWS = require("aws-sdk");

const SchoolTypes = {
    DAY: 'DAY',
    PRE_COLLEGE: 'PRE_COLLEGE',
    PLAY: 'PLAY',
    BOARDING: 'BOARDING'
};
const BoardTypes = {
    CBSE: 'CBSE',
    RBSE: 'RBSE',
    ICSE: 'ICSE',
    ICGSE: 'ICGSE'
};
const ClassificationTypes = {
    COED: 'COED',
    BOYS: 'BOYS',
    GIRLS: 'GIRLS'
}

const AWSconfig = {
    BUCKET_NAME: "null",
    IAM_USER_KEY: "sorry bhai",
    IAM_USER_SECRET: "kyu btau"
};

const { IAM_USER_KEY, IAM_USER_SECRET } = AWSconfig;

AWSconfig.s3 = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET
});

const FREE_CREDITS = {
    firstTime: 200
};

const QueryUnlockCredits = 100;

module.exports = {
    SchoolTypes,
    BoardTypes,
    ClassificationTypes,
    AWSconfig,
    FREE_CREDITS,
    QueryUnlockCredits
}
