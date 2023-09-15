import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { isDev } from './constants';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    //console.log('exception', exception);
    if (isDev) {
      console.log('exception', exception);
    }

    let status = 500;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    } else if (exception.status) {
      status = exception.status;
    }

    let message: string | string[] = '';
    if (exception instanceof HttpException) {
      const httpResponse = exception.getResponse() as IExceptionResponse;
      message = httpResponse.message;
    } else if (status === 404) {
      message = 'Route not found';
    } else if (status === 429) {
      message = 'Too many request';
    } else {
      message = 'Internal server error';
    }

    response.status(status).json({
      meta: {
        status,
        message,
      },
    });
  }
}

interface IExceptionResponse {
  statusCode: number;
  message: string[];
  error: string;
}
