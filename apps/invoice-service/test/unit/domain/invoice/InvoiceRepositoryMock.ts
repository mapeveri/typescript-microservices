import { InvoiceRepository } from '../../../../src/domain/invoice/InvoiceRepository';
import { Invoice } from '../../../../src/domain/invoice/Invoice';
import { InvoiceId } from '../../../../src/domain/invoice/InvoiceId';
import { OrderId } from '../../../../src/domain/invoice/OrderId';

export class InvoiceRepositoryMock implements InvoiceRepository {
  private changed: boolean = false;
  private invoicesStored: Invoice[] = [];
  private toReturn: Invoice[] = [];

  constructor() {
    this.toReturn = [];
    this.changed = false;
    this.invoicesStored = [];
  }

  add(invoice: Invoice): void {
    this.toReturn.push(invoice);
  }

  clean(): void {
    this.toReturn = [];
    this.changed = false;
    this.invoicesStored = [];
  }

  storedChanged(): boolean {
    return this.changed;
  }

  stored(): Invoice[] {
    return this.invoicesStored;
  }

  async findById(_id: InvoiceId): Promise<Invoice | undefined> {
    return this.toReturn.length > 0
      ? Promise.resolve(this.toReturn[0])
      : Promise.resolve(undefined);
  }

  async findByOrderId(_orderId: OrderId): Promise<Invoice | undefined> {
    return this.toReturn.length > 0
      ? Promise.resolve(this.toReturn[0])
      : Promise.resolve(undefined);
  }

  async save(invoice: Invoice): Promise<void> {
    this.changed = true;
    this.invoicesStored.push(invoice);
    return Promise.resolve();
  }
}
