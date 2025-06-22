import InvalidValueException from '@app/shared/domain/exception/InvalidValueException';

export class InvalidInvoiceFileException extends InvalidValueException {
  static readonly CODE = 'invalid_price';

  constructor(message: string) {
    super(message, InvalidInvoiceFileException.CODE);
  }

  static create(): InvalidInvoiceFileException {
    return new InvalidInvoiceFileException('Invalid invoice content');
  }
}
