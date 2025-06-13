class ApiResponse {
    constructor(success, message, data = null, statusCode = 200) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
        this.timestamp = new Date().toISOString();
    }

    static success(message, data = null, statusCode = 200) {
        return new ApiResponse(true, message, data, statusCode);
    }

    static error(message, statusCode = 500, data = null) {
        return new ApiResponse(false, message, data, statusCode);
    }

    send(res) {
        const response = {
            success: this.success,
            message: this.message,
            timestamp: this.timestamp
        };

        if (this.data !== null) {
            response.data = this.data;
        }

        return res.status(this.statusCode).json(response);
    }
}

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    ApiResponse,
    AppError
};
