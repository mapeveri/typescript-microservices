import { InvoiceId } from '../../../../src/domain/invoice/InvoiceId';

export class InvoiceIdMother {
  static random(): InvoiceId {
    return InvoiceId.random();
  }

  static create(value: string): InvoiceId {
    return InvoiceId.of(value);
  }
}
