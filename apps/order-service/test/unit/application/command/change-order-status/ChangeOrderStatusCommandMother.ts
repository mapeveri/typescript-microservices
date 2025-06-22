import { faker } from '@faker-js/faker';
import { OrderStatusMother } from '../../../domain/order/OrderStatusMother';
import { ChangeOrderStatusCommand } from '../../../../../src/application/command/change-order-status/ChangeOrderStatusCommand';
import { Order } from '../../../../../src/domain/order/Order';

interface ChangeOrderStatusCommandProps {
  id?: string;
  sellerId?: string;
  status?: string;
}

export class ChangeOrderStatusCommandMother {
  static random(
    props?: ChangeOrderStatusCommandProps,
  ): ChangeOrderStatusCommand {
    const { id, sellerId, status } = props ?? {};

    return new ChangeOrderStatusCommand(
      id ?? faker.string.uuid(),
      sellerId ?? faker.string.uuid(),
      status ?? OrderStatusMother.random().toString(),
    );
  }

  static fromOrder(order: Order): ChangeOrderStatusCommand {
    const values = order.toPrimitives();
    return ChangeOrderStatusCommandMother.random({
      id: values.id,
      sellerId: values.sellerId,
      status: values.status,
    });
  }

  static withStatusAccepted(): ChangeOrderStatusCommand {
    return ChangeOrderStatusCommandMother.random({
      status: OrderStatusMother.accepted().toString(),
    });
  }
}
