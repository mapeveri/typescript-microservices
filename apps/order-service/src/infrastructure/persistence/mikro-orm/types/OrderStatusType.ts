import { Type } from '@mikro-orm/core';
import { OrderStatus } from '../../../../domain/order/OrderStatus';

export class OrderStatusType extends Type<OrderStatus, string> {
  convertToDatabaseValue(value: OrderStatus): string {
    return value.toString();
  }

  convertToJSValue(value: string): OrderStatus {
    return OrderStatus.fromPrimitives(value);
  }

  getColumnType(): string {
    return 'string';
  }
}
