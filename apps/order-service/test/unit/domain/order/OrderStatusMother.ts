import { OrderStatus } from '../../../../src/domain/order/OrderStatus';
import { OrderStatusType } from '@app/shared/domain/order/OrderStatusType';

export class OrderStatusMother {
  static random(): OrderStatus {
    const values = Object.values(OrderStatusType);
    const randomValue = values[Math.floor(Math.random() * values.length)];
    return OrderStatus.of(randomValue);
  }

  static create(value: string): OrderStatus {
    return OrderStatus.of(value);
  }

  static created(): OrderStatus {
    return OrderStatus.of(OrderStatusType.CREATED);
  }

  static accepted(): OrderStatus {
    return OrderStatus.of(OrderStatusType.ACCEPTED);
  }
}
