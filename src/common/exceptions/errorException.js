import GeneralError from "./generalError";
import {
  badRequest,
  unAuthorized,
  forbidden,
  notFound,
  conflictError,
  validationError,
  internalServerError,
} from "./statusCodes";

class CustomException extends GeneralError {
  constructor(status, message) {
    super();
    this.success = false;
    this.status = status;
    this.message = message;
  }

  toResponse() {
    return {
      success: this.success,
      status: this.status,
      message: this.message,
    };
  }
}

// Bad Request Exception
export class BadRequestException extends CustomException {
  constructor(message) {
    super(badRequest, message);
  }
}

// Not Found Exception
export class NotFoundException extends CustomException {
  constructor(message) {
    super(notFound, message);
  }
}

// Forbidden Exception
export class ForbiddenException extends CustomException {
  constructor(message) {
    super(forbidden, message);
  }
}

// Conflict Exception
export class ConflictException extends CustomException {
  constructor(message) {
    super(conflictError, message);
  }
}

// Unauthorized Exception
export class UnauthorizedException extends CustomException {
  constructor(message) {
    super(unAuthorized, message);
  }
}

// Internal Server Error Exception
export class InternalServerError extends CustomException {
  constructor(message) {
    super(internalServerError, message);
  }
}

// Validation Error Exception
export class ValidationError extends CustomException {
  constructor(message) {
    super(validationError, message);
  }
}
