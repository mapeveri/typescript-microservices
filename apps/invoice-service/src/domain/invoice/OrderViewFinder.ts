import { OrderView } from './OrderView';
import { OrderId } from './OrderId';
import { SellerId } from './SellerId';

export interface OrderViewFinder {
  find(id: OrderId, sellerId: SellerId): Promise<OrderView | undefined>;
}

export const ORDER_VIEW_FINDER = Symbol('OrderViewFinder');
