import { Order } from './Order';
import { OrderId } from './OrderId';
import { SellerId } from './SellerId';

export interface OrderRepository {
  find(id: OrderId, sellerId: SellerId): Promise<Order | undefined>;
}

export const ORDER_REPOSITORY = Symbol('OrderRepository');
