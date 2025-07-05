import { faker } from '@faker-js/faker';
import { Order } from '../../../../src/domain/invoice/Order';
import { OrderStatusType } from '@app/shared/domain/order/OrderStatusType';
import { UploadInvoiceCommand } from '../../../../src/application/command/upload-invoice/UploadInvoiceCommand';

interface OrderViewProps {
  id?: string;
  sellerId?: string;
  status?: string;
}

export class OrderMother {
  static random(props?: OrderViewProps): Order {
    const { id, sellerId, status } = props ?? {};

    const values = Object.values(OrderStatusType);
    const randomValue = values[Math.floor(Math.random() * values.length)];

    return <Order>{
      id: id ?? faker.string.uuid(),
      sellerId: sellerId ?? faker.string.uuid(),
      status: status ?? randomValue.toString(),
    };
  }

  static fromUploadInvoiceCommand(command: UploadInvoiceCommand): Order {
    return OrderMother.random({
      id: command.id,
      sellerId: command.sellerId,
    });
  }
}
