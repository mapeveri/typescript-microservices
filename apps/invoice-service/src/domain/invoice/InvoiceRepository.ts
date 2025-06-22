import { InvoiceId } from './InvoiceId';
import { Invoice } from './Invoice';
import { OrderId } from './OrderId';

export interface InvoiceRepository {
  findById(id: InvoiceId): Promise<Invoice | undefined>;

  findByOrderId(orderId: OrderId): Promise<Invoice | undefined>;

  save(invoice: Invoice): Promise<void>;
}

export const INVOICE_REPOSITORY = Symbol('InvoiceRepository');
