import { DomainEvent } from '@app/shared/domain/bus/event-bus/DomainEvent';
import { Order } from './Order';

export class OrderWasCreatedEvent extends DomainEvent {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly customerId: string,
    public readonly sellerId: string,
    public readonly status: string,
    public readonly price: number,
    public readonly quantity: number,
    public readonly eventId = '',
  ) {
    super(id, eventId);
  }

  static fromOrder(order: Order): OrderWasCreatedEvent {
    const values = order.toPrimitives();
    return new OrderWasCreatedEvent(
      values.id,
      values.productId,
      values.customerId,
      values.sellerId,
      values.status,
      values.price,
      values.quantity,
    );
  }

  domainEventName(): string {
    return 'order.OrderWasCreatedEvent';
  }
}
