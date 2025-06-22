import CreateOrderCommand from './CreateOrderCommand';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OrderId } from '../../../domain/order/OrderId';
import { ProductId } from '../../../domain/order/ProductId';
import { CustomerId } from '../../../domain/order/CustomerId';
import { SellerId } from '../../../domain/order/SellerId';
import { Price } from '../../../domain/order/Price';
import { Quantity } from '../../../domain/order/Quantity';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '../../../domain/order/OrderRepository';
import { Inject } from '@nestjs/common';
import { OrderAlreadyExistsException } from '../../../domain/order/OrderAlreadyExistsException';
import { Order } from '../../../domain/order/Order';
import { EVENT_BUS, EventBus } from '@app/shared/domain/bus/event-bus/EventBus';

@CommandHandler(CreateOrderCommand)
export default class CreateOrderCommandHandler
  implements ICommandHandler<CreateOrderCommand>
{
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    @Inject(EVENT_BUS) private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateOrderCommand): Promise<void> {
    const orderId = OrderId.of(command.id);
    const productId = ProductId.of(command.productId);
    const customerId = CustomerId.of(command.customerId);
    const sellerId = SellerId.of(command.sellerId);
    const price = Price.of(command.price);
    const quantity = Quantity.of(command.quantity);

    await this.ensureOrderDoesNotExist(orderId);

    const order = Order.create(
      orderId,
      productId,
      customerId,
      sellerId,
      price,
      quantity,
    );

    await this.orderRepository.save(order);

    void this.eventBus.publish(order.pullDomainEvents());
  }

  private async ensureOrderDoesNotExist(orderId: OrderId): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (order) {
      throw OrderAlreadyExistsException.ofId(orderId.toString());
    }
  }
}
