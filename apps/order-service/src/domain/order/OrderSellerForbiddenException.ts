import ForbiddenException from '@app/shared/domain/exception/ForbiddenException';

export class OrderSellerForbiddenException extends ForbiddenException {
  static readonly CODE = 'order_seller_forbidden';

  constructor(message: string) {
    super(message, OrderSellerForbiddenException.CODE);
  }

  static ofId(orderId: string): OrderSellerForbiddenException {
    return new OrderSellerForbiddenException(
      `Order seller forbidden: ${orderId}`,
    );
  }
}
