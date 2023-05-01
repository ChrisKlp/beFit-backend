/* eslint-disable no-console */
import { Response } from 'express';
import { AppError, StatusCode } from './AppError';

class ErrorHandler {
  public handleError(error: Error | AppError, response?: Response): void {
    if (this.isTrustedError(error) && response) {
      this.handleTrustedError(error as AppError, response);
    } else {
      this.handleUntrustedError(error, response);
    }
  }

  public isTrustedError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }

    return false;
  }

  private handleTrustedError(error: AppError, response: Response): void {
    response.status(error.statusCode).json({
      message: error.message,
    });
  }

  private handleUntrustedError(error: Error, response?: Response): void {
    if (response) {
      response.status(StatusCode.ServerError).json({
        message: 'Something went wrong',
      });
    }

    console.log('Untrusted error: ', error);
  }
}

const errorHandler = new ErrorHandler();

export default errorHandler;
