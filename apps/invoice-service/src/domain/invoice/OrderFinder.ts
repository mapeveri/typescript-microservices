import { Order } from './Order';
import { OrderId } from './OrderId';
import { SellerId } from './SellerId';

export interface OrderFinder {
  find(id: OrderId, sellerId: SellerId): Promise<Order | undefined>;
}

export const ORDER_FINDER = Symbol('OrderFinder');
