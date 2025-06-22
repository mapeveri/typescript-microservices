export class UploadInvoiceCommand {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly sellerId: string,
    public readonly invoiceFile: string,
  ) {}
}
