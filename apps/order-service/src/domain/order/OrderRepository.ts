import { Order } from './Order';
import { OrderId } from './OrderId';
import { SellerId } from './SellerId';

export type OrderFilters = {
  sellerId: SellerId;
};

export interface OrderRepository {
  findById(id: OrderId): Promise<Order | undefined>;

  findAll(filters: OrderFilters): Promise<Order[]>;

  save(order: Order): Promise<void>;
}

export const ORDER_REPOSITORY = Symbol('OrderRepository');
