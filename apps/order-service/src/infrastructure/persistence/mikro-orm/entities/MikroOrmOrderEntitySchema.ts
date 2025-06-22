import { EntitySchema } from '@mikro-orm/core';
import { Order } from '../../../../domain/order/Order';
import { OrderIdType } from '../types/OrderIdType';
import { ProductIdType } from '../types/ProductIdType';
import { SellerIdType } from '../types/SellerIdType';
import { OrderStatusType } from '../types/OrderStatusType';
import { PriceType } from '../types/PriceType';
import { QuantityType } from '../types/QuantityType';
import { CustomerIdType } from '../types/CustomerIdType';

export const MikroOrmOrderEntitySchema = new EntitySchema<Order>({
  class: Order,
  name: 'Order',
  tableName: 'orders',
  properties: {
    id: {
      type: OrderIdType,
      primary: true,
      fieldName: '_id',
    },
    productId: { type: ProductIdType },
    customerId: { type: CustomerIdType },
    sellerId: { type: SellerIdType },
    status: {
      type: OrderStatusType,
    },
    price: { type: PriceType },
    quantity: { type: QuantityType },
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
