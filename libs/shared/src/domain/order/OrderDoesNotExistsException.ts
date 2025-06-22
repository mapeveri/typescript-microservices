import NotFoundException from '@app/shared/domain/exception/NotFoundException';

export class OrderDoesNotExistsException extends NotFoundException {
  static readonly CODE = 'order_does_not_exists';

  constructor(message: string) {
    super(message, OrderDoesNotExistsException.CODE);
  }

  static ofId(orderId: string): OrderDoesNotExistsException {
    return new OrderDoesNotExistsException(`Order ${orderId} does not exists`);
  }
}
