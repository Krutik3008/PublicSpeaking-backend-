// Standardized API response helper

class ResponseHelper {
    // Success response
    static success(res, data, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    // Error response
    static error(res, message = 'Error occurred', statusCode = 500) {
        return res.status(statusCode).json({
            success: false,
            message
        });
    }

    // Created response
    static created(res, data, message = 'Created successfully') {
        return this.success(res, data, message, 201);
    }

    // Not found response
    static notFound(res, message = 'Resource not found') {
        return this.error(res, message, 404);
    }

    // Unauthorized response
    static unauthorized(res, message = 'Not authorized') {
        return this.error(res, message, 401);
    }

    // Bad request response
    static badRequest(res, message = 'Bad request') {
        return this.error(res, message, 400);
    }

    // Paginated response
    static paginated(res, data, page, limit, total) {
        return res.status(200).json({
            success: true,
            data,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    }
}

module.exports = ResponseHelper;
