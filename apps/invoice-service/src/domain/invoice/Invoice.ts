import { InvoiceId } from './InvoiceId';
import { OrderId } from './OrderId';
import { SellerId } from './SellerId';
import { AggregateRoot } from '@app/shared/domain/aggregate/AggregateRoot';
import { InvoiceWasUploadedEvent } from './InvoiceWasUploadedEvent';
import { InvoiceSellerForbiddenException } from './InvoiceSellerForbiddenException';
import { InvoiceWasSentEvent } from './InvoiceWasSentEvent';

export type InvoicePrimitives = {
  id: string;
  orderId: string;
  sellerId: string;
  filePath: string;
  sentAt?: string;
};

export class Invoice extends AggregateRoot {
  constructor(
    private id: InvoiceId,
    private orderId: OrderId,
    private sellerId: SellerId,
    private filePath: string,
    private sentAt?: Date,
  ) {
    super();
  }

  static upload(
    id: InvoiceId,
    orderId: OrderId,
    sellerId: SellerId,
    filePath: string,
  ) {
    const invoice = new Invoice(id, orderId, sellerId, filePath);

    invoice.record(InvoiceWasUploadedEvent.fromInvoice(invoice));

    return invoice;
  }

  send(sellerId: SellerId, sendAt: string) {
    if (this.sentAt) {
      return;
    }

    this.assertOwnedBySeller(sellerId);

    this.sentAt = new Date(sendAt);

    this.record(InvoiceWasSentEvent.fromInvoice(this));
  }

  private assertOwnedBySeller(sellerId: SellerId) {
    if (!this.sellerId.equals(sellerId)) {
      throw InvoiceSellerForbiddenException.ofId(this.id.toString());
    }
  }

  toPrimitives(): InvoicePrimitives {
    return {
      id: this.id.toString(),
      orderId: this.orderId.toString(),
      sellerId: this.sellerId.toString(),
      filePath: this.filePath,
      sentAt: this.sentAt?.toISOString(),
    };
  }
}
