import InvalidQuantityException from './InvalidQuantityException';

export class Quantity {
  private constructor(private value: number) {}

  static of(value: number): Quantity {
    if (value < 0) {
      throw InvalidQuantityException.forValue(value);
    }

    return new this(value);
  }

  static fromPrimitives(value: number): Quantity {
    return new this(value);
  }

  total(): number {
    return this.value;
  }
}
