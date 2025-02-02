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

// Bad Request Exception
export class BadRequestException extends GeneralError {
  constructor(message) {
    super();
    this.status = badRequest;
    this.message = message;
  }
}

// Not Found Exception
export class NotFoundException extends GeneralError {
  constructor(message) {
    super();
    this.status = notFound;
    this.message = message;
  }
}

// Forbidden Exception
export class ForbiddenException extends GeneralError {
  constructor(message) {
    super();
    this.status = forbidden;
    this.message = message;
  }
}

// Conflict Exception
export class ConflictException extends GeneralError {
  constructor(message) {
    super();
    this.status = conflictError;
    this.message = message;
  }
}

// Unauthorized Exception
export class UnauthorizedException extends GeneralError {
  constructor(message) {
    super();
    this.status = unAuthorized;
    this.message = message;
  }
}

// Internal Server Error Exception
export class InternalServerError extends GeneralError {
  constructor(message) {
    super();
    this.status = internalServerError;
    this.message = message;
  }
}

// Validation Error Exception
export class ValidationError extends GeneralError {
  constructor(message) {
    super();
    this.status = validationError;
    this.message = message;
  }
}
