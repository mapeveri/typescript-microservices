import { ListOrdersQuery } from '../../../../../src/application/query/list-orders/ListOrdersQuery';
import { faker } from '@faker-js/faker';

export class ListOrdersQueryMother {
  static random(sellerId?: string): ListOrdersQuery {
    return new ListOrdersQuery(sellerId ?? faker.string.uuid());
  }
}
