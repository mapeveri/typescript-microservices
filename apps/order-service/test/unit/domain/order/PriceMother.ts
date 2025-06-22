import { Price } from '../../../../src/domain/order/Price';

export class PriceMother {
  static random(): Price {
    const randomValue = Math.random() * 1000 + 0.01;
    return Price.of(randomValue);
  }

  static create(value: number): Price {
    return Price.of(value);
  }
}
