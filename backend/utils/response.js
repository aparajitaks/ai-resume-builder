/**
 * Standardized API Response Format
 */
export const sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export const successResponse = (res, data, message = "Success", statusCode = 200) => {
  return sendResponse(res, statusCode, true, message, data);
};

export const errorResponse = (res, message = "Error", statusCode = 500) => {
  return sendResponse(res, statusCode, false, message);
};
