import { GetOrderDetailQuery } from './GetOrderDetailQuery';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '../../../domain/order/OrderRepository';
import { Inject } from '@nestjs/common';
import { OrderId } from '../../../domain/order/OrderId';
import { Order } from '../../../domain/order/Order';
import { OrderDoesNotExistsException } from '@app/shared/domain/order/OrderDoesNotExistsException';
import { GetOrderDetailQueryResponse } from './GetOrderDetailQueryResponse';
import { SellerId } from '../../../domain/order/SellerId';

@QueryHandler(GetOrderDetailQuery)
export class GetOrderDetailQueryHandler
  implements IQueryHandler<GetOrderDetailQuery>
{
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
  ) {}

  async execute(
    query: GetOrderDetailQuery,
  ): Promise<GetOrderDetailQueryResponse> {
    const orderId = OrderId.of(query.orderId);
    const sellerId = SellerId.of(query.sellerId);
    const order = await this.getOrder(orderId);
    order.assertOwnedBySeller(sellerId);

    return new GetOrderDetailQueryResponse(order.toPrimitives());
  }

  private async getOrder(orderId: OrderId): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw OrderDoesNotExistsException.ofId(orderId.toString());
    }

    return order;
  }
}
