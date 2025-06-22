import { faker } from '@faker-js/faker';
import { GetOrderDetailQuery } from '../../../../../src/application/query/get-order-detail/GetOrderDetailQuery';

export class GetOrderDetailQueryMother {
  static random(params?: {
    id?: string;
    sellerId?: string;
  }): GetOrderDetailQuery {
    return new GetOrderDetailQuery(
      params?.id ?? faker.string.uuid(),
      params?.sellerId ?? faker.string.uuid(),
    );
  }
}
