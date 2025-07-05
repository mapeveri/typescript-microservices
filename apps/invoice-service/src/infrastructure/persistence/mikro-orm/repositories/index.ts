import { INVOICE_REPOSITORY } from '../../../../domain/invoice/InvoiceRepository';
import { MikroOrmInvoiceRepository } from './MikroOrmInvoiceRepository';
import { MikroOrmOrderFinder } from './MikroOrmOrderFinder';
import { ORDER_REPOSITORY } from '../../../../domain/invoice/OrderRepository';

export const repositories = [
  {
    provide: INVOICE_REPOSITORY,
    useClass: MikroOrmInvoiceRepository,
  },
  {
    provide: ORDER_REPOSITORY,
    useClass: MikroOrmOrderFinder,
  },
];
