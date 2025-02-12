import { validationError } from "../exceptions/statusCodes";
import GeneralError from "../../common/exceptions/generalError";

const errorHandler = (error, req, res, next) => {
  if (error instanceof GeneralError) {
    return res.status(error.status).json({
      success: false,
      status: error.status,
      message: error.message,
    });
  }

  if (error && error.error && error.error.isJoi) {
    return res.status(validationError).json({
      success: false,
      status: validationError,
      message: error.error.details[0].message,
    });
  }

  if (error.statusCode) {
    return res.status(error.statusCode).json({
      success: false,
      status: error.statusCode,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    status: 500,
    message: "Internal Server Error",
  });
};

export default errorHandler;
