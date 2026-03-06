/**
 * Standardized API Response Format
 */

class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

const sendSuccess = (res, statusCode, data, message = 'Request successful') => {
  return res.status(statusCode).json(
    new ApiResponse(statusCode, data, message)
  );
};

const sendError = (res, statusCode, message = 'An error occurred', data = null) => {
  return res.status(statusCode).json({
    statusCode,
    message,
    data,
    success: false,
  });
};

module.exports = { ApiResponse, sendSuccess, sendError };
