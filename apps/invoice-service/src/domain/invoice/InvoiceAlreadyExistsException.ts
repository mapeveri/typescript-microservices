import ConflictException from '@app/shared/domain/exception/ConflictException';

export class InvoiceAlreadyExistsException extends ConflictException {
  static readonly CODE = 'invoice_already_exists';

  constructor(message: string) {
    super(message, InvoiceAlreadyExistsException.CODE);
  }

  static ofId(invoiceId: string): InvoiceAlreadyExistsException {
    return new InvoiceAlreadyExistsException(
      `Invoice ${invoiceId} already exists`,
    );
  }
}
