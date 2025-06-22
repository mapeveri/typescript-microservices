import InvalidValueException from '@app/shared/domain/exception/InvalidValueException';

export default class InvalidQuantityException extends InvalidValueException {
  static readonly CODE = 'invalid_price';

  constructor(message: string) {
    super(message, InvalidQuantityException.CODE);
  }

  static forValue(value: number): InvalidQuantityException {
    return new InvalidQuantityException(`${value} is an invalid quantity`);
  }
}
