import NotFoundException from '@app/shared/domain/exception/NotFoundException';

export class InvoiceDoesNotExistsException extends NotFoundException {
  static readonly CODE = 'order_does_not_exists';

  constructor(message: string) {
    super(message, InvoiceDoesNotExistsException.CODE);
  }

  static ofOrderId(orderId: string): InvoiceDoesNotExistsException {
    return new InvoiceDoesNotExistsException(
      `Invoice with orderId ${orderId} does not exists`,
    );
  }
}
