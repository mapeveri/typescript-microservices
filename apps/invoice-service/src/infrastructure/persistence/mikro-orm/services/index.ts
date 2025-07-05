import { MikroOrmOrderFinder } from './MikroOrmOrderFinder';
import { ORDER_FINDER } from '../../../../domain/invoice/OrderFinder';

export const services = [
  {
    provide: ORDER_FINDER,
    useClass: MikroOrmOrderFinder,
  },
];
