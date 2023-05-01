export enum StatusCode {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  Conflict = 409,
  NotFound = 404,
  ServerError = 500,
}

export class AppError extends Error {
  public readonly statusCode: StatusCode;

  public readonly isOperational: boolean = true;

  constructor(
    message: string,
    statusCode: StatusCode,
    isOperational?: boolean
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    if (isOperational !== undefined) {
      this.isOperational = isOperational;
    }

    Error.captureStackTrace(this);
  }
}
