import { ListOrdersQuery } from './ListOrdersQuery';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '../../../domain/order/OrderRepository';
import { Inject } from '@nestjs/common';
import { ListOrdersQueryResponse } from './ListOrdersQueryResponse';
import { Order } from '../../../domain/order/Order';
import { SellerId } from '../../../domain/order/SellerId';

@QueryHandler(ListOrdersQuery)
export class ListOrdersQueryHandler implements IQueryHandler<ListOrdersQuery> {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
  ) {}

  async execute(query: ListOrdersQuery): Promise<ListOrdersQueryResponse> {
    const sellerId = SellerId.of(query.sellerId);
    const orders = await this.orderRepository.findAll({ sellerId });

    return new ListOrdersQueryResponse(
      orders.map((order: Order) => order.toPrimitives()),
    );
  }
}
