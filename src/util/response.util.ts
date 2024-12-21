import { Response } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';

interface IResponseBody<T = any> {
  status: number;
  message: string;
  data?: T;
}

//
// ERROR
//
export class CustomError extends HttpException {
  constructor(
    status: HttpStatus | number,
    message: string,
    data?: Record<string, any>,
  ) {
    const validStatus = status || HttpStatus.INTERNAL_SERVER_ERROR;

    super(
      {
        status: validStatus,
        message,
        data: data || undefined,
      },
      validStatus,
    );
  }
}

export class BadRequest extends CustomError {
  constructor(message: string, errorData?: Record<string, any>) {
    super(HttpStatus.BAD_REQUEST, message, errorData);
  }
}

export class Unauthorized extends CustomError {
  constructor(message: string, errorData?: Record<string, any>) {
    super(HttpStatus.UNAUTHORIZED, message, errorData);
  }
}

export class Forbidden extends CustomError {
  constructor(message: string, errorData?: Record<string, any>) {
    super(HttpStatus.FORBIDDEN, message, errorData);
  }
}
export class NotFound extends CustomError {
  constructor(message: string, errorData?: Record<string, any>) {
    super(HttpStatus.NOT_FOUND, message, errorData);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string, errorData?: Record<string, any>) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message, errorData);
  }
}

//
// ACCEPTED
//
export class ResponseBody implements IResponseBody {
  status: HttpStatus | number;
  message: string;
  data: any;

  constructor(statusCode: HttpStatus | number, message: string, data?: any) {
    this.status = statusCode || 200;
    this.message = message;
    this.data = data;
  }
}

export class Success extends ResponseBody {
  constructor(message: string, data?: any) {
    super(HttpStatus.OK, message, data);
  }
}

export class Created extends ResponseBody {
  constructor(message: string, data?: any) {
    super(HttpStatus.CREATED, message, data);
  }
}

//
// FUNCTIONS
//
export const errorResponse = (error: {
  response: { message: string; data: Record<string, any> | undefined };
  status: number;
  message: string;
}) => {
  if (error.response) {
    throw new CustomError(
      error.status,
      error.response.message,
      error.response.data,
    );
  }

  throw new CustomError(500, error.message);
};

export async function sendResponse(res: Response, data: IResponseBody) {
  res.status(data.status).json({
    status: data.status,
    message: data.message,
    data: data.data ?? undefined,
  });
}
