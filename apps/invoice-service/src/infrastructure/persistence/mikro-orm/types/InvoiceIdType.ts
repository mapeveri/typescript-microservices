import { Type } from '@mikro-orm/core';
import { InvoiceId } from '../../../../domain/invoice/InvoiceId';

export class InvoiceIdType extends Type<InvoiceId, string> {
  convertToDatabaseValue(value: InvoiceId): string {
    return value.toString();
  }

  convertToJSValue(value: string): InvoiceId {
    return InvoiceId.fromPrimitives(value);
  }

  getColumnType(): string {
    return 'string';
  }
}
