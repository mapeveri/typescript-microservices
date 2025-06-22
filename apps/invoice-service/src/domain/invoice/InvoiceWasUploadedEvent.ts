import { DomainEvent } from '@app/shared/domain/bus/event-bus/DomainEvent';
import { Invoice } from './Invoice';

export class InvoiceWasUploadedEvent extends DomainEvent {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly sellerId: string,
    public readonly filePath: string,
    public readonly sentAt?: string,
    public readonly eventId = '',
  ) {
    super(id, eventId);
  }

  static fromInvoice(invoice: Invoice): InvoiceWasUploadedEvent {
    const values = invoice.toPrimitives();
    return new InvoiceWasUploadedEvent(
      values.id,
      values.orderId,
      values.sellerId,
      values.filePath,
      values.sentAt,
    );
  }

  domainEventName(): string {
    return 'invoice.InvoiceWasUploadedEvent';
  }
}
