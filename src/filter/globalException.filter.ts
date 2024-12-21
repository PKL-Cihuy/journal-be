import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';
import { MongooseError } from 'mongoose';

@Catch(HttpException, MongooseError, MongoError, Error)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | MongoError | Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const resp = exception.getResponse() as string;

      return response.status(status).json(resp);
    } else {
      let message = 'Uncaught Error';

      if (exception instanceof MongoError) {
        message = 'MongoDB Error';
      }

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: message,
        error: exception.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
