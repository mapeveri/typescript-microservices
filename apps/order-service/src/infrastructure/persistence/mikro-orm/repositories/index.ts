import { ORDER_REPOSITORY } from '../../../../domain/order/OrderRepository';
import { MikroOrmOrderRepository } from './MikroOrmOrderRepository';

export const repositories = [
  {
    provide: ORDER_REPOSITORY,
    useClass: MikroOrmOrderRepository,
  },
];
