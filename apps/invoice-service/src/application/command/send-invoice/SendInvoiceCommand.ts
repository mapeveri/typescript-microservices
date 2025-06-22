export class SendInvoiceCommand {
  constructor(
    public readonly orderId: string,
    public readonly sellerId: string,
    public readonly sendAt: string,
  ) {}
}
