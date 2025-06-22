import { OrderId } from '../../../../src/domain/invoice/OrderId';

export class OrderIdMother {
  static random(): OrderId {
    return OrderId.random();
  }

  static create(value: string): OrderId {
    return OrderId.of(value);
  }
}
