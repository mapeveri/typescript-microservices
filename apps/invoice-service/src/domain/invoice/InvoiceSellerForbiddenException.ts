import ForbiddenException from '@app/shared/domain/exception/ForbiddenException';

export class InvoiceSellerForbiddenException extends ForbiddenException {
  static readonly CODE = 'invoice_seller_forbidden';

  constructor(message: string) {
    super(message, InvoiceSellerForbiddenException.CODE);
  }

  static ofId(invoiceId: string): InvoiceSellerForbiddenException {
    return new InvoiceSellerForbiddenException(
      `Invoice seller forbidden: ${invoiceId}`,
    );
  }
}
