import DomainException from '@app/shared/domain/exception/DomainException';

export default class ApiExceptionSerializer {
  public static serialize(
    error: DomainException,
    status: number,
  ): Record<string, any> {
    return {
      statusCode: status,
      message: error.message,
      code: error.code,
    };
  }
}
