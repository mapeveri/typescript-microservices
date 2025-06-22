import { Type } from '@mikro-orm/core';
import { OrderId } from '../../../../domain/invoice/OrderId';

export class OrderIdType extends Type<OrderId, string> {
  convertToDatabaseValue(value: OrderId): string {
    return value.toString();
  }

  convertToJSValue(value: string): OrderId {
    return OrderId.fromPrimitives(value);
  }

  getColumnType(): string {
    return 'string';
  }
}
