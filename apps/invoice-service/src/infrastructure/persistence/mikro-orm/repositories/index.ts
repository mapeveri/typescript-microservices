import { INVOICE_REPOSITORY } from '../../../../domain/invoice/InvoiceRepository';
import { MikroOrmInvoiceRepository } from './MikroOrmInvoiceRepository';

export const repositories = [
  {
    provide: INVOICE_REPOSITORY,
    useClass: MikroOrmInvoiceRepository,
  },
];
