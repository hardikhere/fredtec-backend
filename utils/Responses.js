const SendResponse = (res, status = 200, data, message = "", error = false) => {
    return res.status(status).json({
        data: data ? data : {},
        message,
        success: error ? false : true,
        error
    })
};

module.exports = SendResponse;