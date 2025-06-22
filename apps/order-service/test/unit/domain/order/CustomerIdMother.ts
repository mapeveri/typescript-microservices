import { CustomerId } from '../../../../src/domain/order/CustomerId';

export class CustomerIdMother {
  static random(): CustomerId {
    return CustomerId.random();
  }

  static create(value: string): CustomerId {
    return CustomerId.of(value);
  }
}
