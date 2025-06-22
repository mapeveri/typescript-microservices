import { OrderId } from './OrderId';
import { ProductId } from './ProductId';
import { CustomerId } from './CustomerId';
import { SellerId } from './SellerId';
import { OrderStatus } from './OrderStatus';
import { Price } from './Price';
import { Quantity } from './Quantity';
import { AggregateRoot } from '@app/shared/domain/aggregate/AggregateRoot';
import { OrderWasCreatedEvent } from './OrderWasCreatedEvent';
import { OrderSellerForbiddenException } from './OrderSellerForbiddenException';
import { OrderStatusWasChangedEvent } from './OrderStatusWasChangedEvent';

export type OrderPrimitives = {
  id: string;
  productId: string;
  customerId: string;
  sellerId: string;
  status: string;
  price: number;
  quantity: number;
};

export class Order extends AggregateRoot {
  constructor(
    private id: OrderId,
    private productId: ProductId,
    private customerId: CustomerId,
    private sellerId: SellerId,
    private status: OrderStatus,
    private price: Price,
    private quantity: Quantity,
  ) {
    super();
  }

  static create(
    id: OrderId,
    productId: ProductId,
    customerId: CustomerId,
    sellerId: SellerId,
    price: Price,
    quantity: Quantity,
  ): Order {
    const order = new Order(
      id,
      productId,
      customerId,
      sellerId,
      OrderStatus.created(),
      price,
      quantity,
    );

    order.record(OrderWasCreatedEvent.fromOrder(order));

    return order;
  }

  assertOwnedBySeller(sellerId: SellerId) {
    if (!this.sellerId.equals(sellerId)) {
      throw OrderSellerForbiddenException.ofId(this.id.toString());
    }
  }

  changeStatus(status: OrderStatus, sellerId: SellerId): void {
    this.assertOwnedBySeller(sellerId);
    if (this.status.equals(status)) {
      return;
    }

    this.status = status;

    this.record(OrderStatusWasChangedEvent.fromOrder(this));
  }

  toPrimitives(): OrderPrimitives {
    return {
      id: this.id.toString(),
      productId: this.productId.toString(),
      customerId: this.customerId.toString(),
      sellerId: this.sellerId.toString(),
      status: this.status.toString(),
      price: this.price.amount(),
      quantity: this.quantity.total(),
    };
  }
}
