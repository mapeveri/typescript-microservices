import InvalidOrderStatusException from './InvalidOrderStatusException';
import { OrderStatusType } from '@app/shared/domain/order/OrderStatusType';

export class OrderStatus {
  private constructor(private value: string) {}

  static of(value: string): OrderStatus {
    const validValues = Object.values(OrderStatusType);
    if (!validValues.includes(value as OrderStatusType)) {
      throw InvalidOrderStatusException.ofStatus(value);
    }

    return new this(value);
  }

  static fromPrimitives(value: string): OrderStatus {
    return new this(value);
  }

  static created(): OrderStatus {
    return new this(OrderStatusType.CREATED);
  }

  equals(other: OrderStatus): boolean {
    return other.value === this.value;
  }

  toString(): string {
    return this.value;
  }
}
