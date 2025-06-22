import { ChangeOrderStatusCommand } from './ChangeOrderStatusCommand';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '../../../domain/order/OrderRepository';
import { EVENT_BUS, EventBus } from '@app/shared/domain/bus/event-bus/EventBus';
import { OrderId } from '../../../domain/order/OrderId';
import { SellerId } from '../../../domain/order/SellerId';
import { OrderStatus } from '../../../domain/order/OrderStatus';
import { Order } from '../../../domain/order/Order';
import { OrderDoesNotExistsException } from '@app/shared/domain/order/OrderDoesNotExistsException';

@CommandHandler(ChangeOrderStatusCommand)
export class ChangeOrderStatusCommandHandler
  implements ICommandHandler<ChangeOrderStatusCommand>
{
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    @Inject(EVENT_BUS) private readonly eventBus: EventBus,
  ) {}

  async execute(command: ChangeOrderStatusCommand): Promise<void> {
    const orderId = OrderId.of(command.id);
    const sellerId = SellerId.of(command.sellerId);
    const status = OrderStatus.of(command.status);

    const order = await this.getOrder(orderId);
    order.changeStatus(status, sellerId);

    await this.orderRepository.save(order);

    void this.eventBus.publish(order.pullDomainEvents());
  }

  private async getOrder(orderId: OrderId): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw OrderDoesNotExistsException.ofId(orderId.toString());
    }

    return order;
  }
}
