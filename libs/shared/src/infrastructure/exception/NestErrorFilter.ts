import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import NotFoundException from '@app/shared/domain/exception/NotFoundException';
import ForbiddenException from '@app/shared/domain/exception/ForbiddenException';
import ApiExceptionSerializer from '@app/shared/infrastructure/exception/serializers/ApiExceptionSerializer';
import DomainException from '@app/shared/domain/exception/DomainException';
import InvalidValueException from '@app/shared/domain/exception/InvalidValueException';
import ConflictException from '@app/shared/domain/exception/ConflictException';

@Catch(Error)
export class NestErrorFilter implements ExceptionFilter {
  private mappedExceptions = [
    { exceptionType: ConflictException, status: HttpStatus.CONFLICT },
    {
      exceptionType: InvalidValueException,
      status: HttpStatus.BAD_REQUEST,
    },
    { exceptionType: NotFoundException, status: HttpStatus.NOT_FOUND },
    { exceptionType: ForbiddenException, status: HttpStatus.FORBIDDEN },
  ];

  constructor() {}

  catch(exception: Error, host: ArgumentsHost) {
    console.log(`Exception: ${exception}`);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const matchedException = this.mappedExceptions.find(
      (item) => exception instanceof item.exceptionType,
    );
    if (matchedException) {
      const status = matchedException.status;
      response
        .status(status)
        .json(
          ApiExceptionSerializer.serialize(
            exception as DomainException,
            status,
          ),
        );
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      response
        .status(status)
        .json({ statusCode: status, message: exception.message });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
      code: 'generic_error',
    });
  }
}
