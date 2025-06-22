import { Quantity } from '../../../../src/domain/order/Quantity';

export class QuantityMother {
  static random(): Quantity {
    return Quantity.of(1);
  }

  static create(value: number): Quantity {
    return Quantity.of(value);
  }
}
