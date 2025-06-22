import InvalidValueException from '@app/shared/domain/exception/InvalidValueException';

export default class InvalidPriceException extends InvalidValueException {
  static readonly CODE = 'invalid_price';

  constructor(message: string) {
    super(message, InvalidPriceException.CODE);
  }

  static forValue(value: number): InvalidPriceException {
    return new InvalidPriceException(`${value} is an invalid price`);
  }
}
