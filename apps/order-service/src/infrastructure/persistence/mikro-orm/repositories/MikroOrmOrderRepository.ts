import { InjectRepository } from '@mikro-orm/nestjs';
import { MikroOrmOrderEntitySchema } from '../entities/MikroOrmOrderEntitySchema';
import { EntityRepository } from '@mikro-orm/core';
import {
  OrderFilters,
  OrderRepository,
} from '../../../../domain/order/OrderRepository';
import { Injectable } from '@nestjs/common';
import { Order } from '../../../../domain/order/Order';
import { OrderId } from '../../../../domain/order/OrderId';

@Injectable()
export class MikroOrmOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(MikroOrmOrderEntitySchema)
    private readonly orderRepository: EntityRepository<Order>,
  ) {}

  async findById(id: OrderId): Promise<Order | undefined> {
    const order = await this.orderRepository.findOne({ id });

    if (!order) return undefined;
    return order;
  }

  async findAll(filters: OrderFilters): Promise<Order[]> {
    return this.orderRepository.find({ sellerId: filters.sellerId });
  }

  async save(order: Order): Promise<void> {
    return this.orderRepository.getEntityManager().persistAndFlush(order);
  }
}
