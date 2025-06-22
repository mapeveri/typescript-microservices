import { EntitySchema } from '@mikro-orm/core';
import { Invoice } from '../../../../domain/invoice/Invoice';
import { OrderIdType } from '../types/OrderIdType';
import { SellerIdType } from '../types/SellerIdType';
import { InvoiceIdType } from '../types/InvoiceIdType';

export const MikroOrmInvoiceEntitySchema = new EntitySchema<Invoice>({
  class: Invoice,
  name: 'Invoice',
  tableName: 'invoices',
  properties: {
    id: {
      type: InvoiceIdType,
      primary: true,
      fieldName: '_id',
    },
    orderId: {
      type: OrderIdType,
    },
    sellerId: { type: SellerIdType },
    filePath: {
      type: 'string',
    },
    sentAt: { type: 'Date', nullable: true },
    createdAt: {
      type: 'Date',
      onCreate: () => new Date(),
    },
    updatedAt: {
      type: 'Date',
      onCreate: () => new Date(),
      onUpdate: () => new Date(),
    },
  },
});
