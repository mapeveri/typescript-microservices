import { SellerId } from '../../../../src/domain/order/SellerId';

export class SellerIdMother {
  static random(): SellerId {
    return SellerId.random();
  }

  static create(value: string): SellerId {
    return SellerId.of(value);
  }
}
