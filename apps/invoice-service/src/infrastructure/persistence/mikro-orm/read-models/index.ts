import { MikroOrmOrderViewFinder } from './MikroOrmOrderViewFinder';
import { ORDER_VIEW_FINDER } from '../../../../domain/invoice/OrderViewFinder';

export const readModels = [
  {
    provide: ORDER_VIEW_FINDER,
    useClass: MikroOrmOrderViewFinder,
  },
];
