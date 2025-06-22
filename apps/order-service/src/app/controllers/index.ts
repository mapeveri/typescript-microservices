import OrderPostController from './create-order/OrderPostController';
import ListOrdersGetController from './list-orders/ListOrdersGetController';
import OrderDetailGetController from './order-detail/OrderDetailGetController';
import OrderStatusPatchController from './update-order/OrderStatusPatchController';

export const controllers = [
  OrderPostController,
  ListOrdersGetController,
  OrderDetailGetController,
  OrderStatusPatchController,
];
