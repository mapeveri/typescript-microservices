import { OrderStatusType } from '@app/shared/domain/order/OrderStatusType';

export type Order = {
  id: string;
  sellerId: string;
  status: OrderStatusType;
};
