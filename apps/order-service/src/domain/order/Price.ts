import InvalidPriceException from './InvalidPriceException';

export class Price {
  private constructor(private value: number) {}

  static of(value: number): Price {
    if (value < 0) {
      throw InvalidPriceException.forValue(value);
    }

    return new this(value);
  }

  static fromPrimitives(value: number): Price {
    return new this(value);
  }

  amount(): number {
    return this.value;
  }
}
