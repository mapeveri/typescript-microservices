import InvalidValueException from '@app/shared/domain/exception/InvalidValueException';

export default class InvalidOrderStatusException extends InvalidValueException {
  static readonly CODE = 'invalid_order_status';

  constructor(message: string) {
    super(message, InvalidOrderStatusException.CODE);
  }

  static ofStatus(status: string): InvalidOrderStatusException {
    return new InvalidOrderStatusException(
      `${status} is an invalid order status`,
    );
  }
}
