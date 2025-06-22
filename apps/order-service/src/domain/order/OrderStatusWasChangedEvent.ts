import { DomainEvent } from '@app/shared/domain/bus/event-bus/DomainEvent';
import { Order } from './Order';

export class OrderStatusWasChangedEvent extends DomainEvent {
  constructor(
    public readonly id: string,
    public readonly sellerId: string,
    public readonly status: string,
    public readonly eventId = '',
  ) {
    super(id, eventId);
  }

  static fromOrder(order: Order): OrderStatusWasChangedEvent {
    const values = order.toPrimitives();
    return new OrderStatusWasChangedEvent(
      values.id,
      values.sellerId,
      values.status,
    );
  }

  domainEventName(): string {
    return 'order.OrderStatusWasChangedEvent';
  }
}
