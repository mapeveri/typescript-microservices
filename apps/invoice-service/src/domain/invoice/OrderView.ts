import { OrderStatusType } from '@app/shared/domain/order/OrderStatusType';

export type OrderView = {
  id: string;
  sellerId: string;
  status: OrderStatusType;
};
