import { faker } from '@faker-js/faker';
import CreateOrderCommand from '../../../../../src/application/command/create-order/CreateOrderCommand';

interface CreateOrderCommandProps {
  id?: string;
  productId?: string;
  customerId?: string;
  sellerId?: string;
  price?: number;
  quantity?: number;
}

export class CreateOrderCommandMother {
  static random(props?: CreateOrderCommandProps): CreateOrderCommand {
    const { id, productId, customerId, sellerId, price, quantity } =
      props ?? {};

    return new CreateOrderCommand(
      id ?? faker.string.uuid(),
      productId ?? faker.string.uuid(),
      customerId ?? faker.string.uuid(),
      sellerId ?? faker.string.uuid(),
      price ?? parseFloat(faker.commerce.price()),
      quantity ?? faker.number.int({ min: 1, max: 1 }),
    );
  }
}
