import ConflictException from '@app/shared/domain/exception/ConflictException';

export class OrderAlreadyExistsException extends ConflictException {
  static readonly CODE = 'order_already_exists';

  constructor(message: string) {
    super(message, OrderAlreadyExistsException.CODE);
  }

  static ofId(orderId: string): OrderAlreadyExistsException {
    return new OrderAlreadyExistsException(`Order ${orderId} already exists`);
  }
}
