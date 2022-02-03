class ExpressError extends Error {
    constructor(message, statusCode) {
        super(); //this one calls Error constructor
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;