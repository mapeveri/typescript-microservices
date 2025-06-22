import { ProductId } from '../../../../src/domain/order/ProductId';

export class ProductIdMother {
  static random(): ProductId {
    return ProductId.random();
  }

  static create(value: string): ProductId {
    return ProductId.of(value);
  }
}
