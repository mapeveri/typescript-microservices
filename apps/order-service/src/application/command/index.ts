import CreateOrderCommandHandler from './create-order/CreateOrderCommandHandler';
import { ChangeOrderStatusCommandHandler } from './change-order-status/ChangeOrderStatusCommandHandler';

export const commands = [
  CreateOrderCommandHandler,
  ChangeOrderStatusCommandHandler,
];
