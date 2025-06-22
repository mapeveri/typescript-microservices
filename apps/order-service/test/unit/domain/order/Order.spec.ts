import { describe, expect, it } from 'vitest';
import { OrderIdMother } from './OrderIdMother';
import { ProductIdMother } from './ProductIdMother';
import { CustomerIdMother } from './CustomerIdMother';
import { SellerIdMother } from './SellerIdMother';
import { OrderStatusMother } from './OrderStatusMother';
import { PriceMother } from './PriceMother';
import { QuantityMother } from './QuantityMother';
import { OrderMother } from './OrderMother';

describe('Given an order', () => {
  const ORDER_VALUES = {
    id: OrderIdMother.random().toString(),
    productId: ProductIdMother.random().toString(),
    customerId: CustomerIdMother.random().toString(),
    sellerId: SellerIdMother.random().toString(),
    status: OrderStatusMother.random().toString(),
    price: PriceMother.random().amount(),
    quantity: QuantityMother.random().total(),
  };

  it('toPrimitives should contains the correct values', () => {
    const order = OrderMother.random(ORDER_VALUES).toPrimitives();

    expect(order).toEqual(ORDER_VALUES);
  });
});
