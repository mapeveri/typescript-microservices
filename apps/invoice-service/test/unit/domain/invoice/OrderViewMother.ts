import { faker } from '@faker-js/faker';
import { OrderView } from '../../../../src/domain/invoice/OrderView';
import { OrderStatusType } from '@app/shared/domain/order/OrderStatusType';
import { UploadInvoiceCommand } from '../../../../src/application/command/upload-invoice/UploadInvoiceCommand';

interface OrderViewProps {
  id?: string;
  sellerId?: string;
  status?: string;
}

export class OrderViewMother {
  static random(props?: OrderViewProps): OrderView {
    const { id, sellerId, status } = props ?? {};

    const values = Object.values(OrderStatusType);
    const randomValue = values[Math.floor(Math.random() * values.length)];

    return <OrderView>{
      id: id ?? faker.string.uuid(),
      sellerId: sellerId ?? faker.string.uuid(),
      status: status ?? randomValue.toString(),
    };
  }

  static fromUploadInvoiceCommand(command: UploadInvoiceCommand): OrderView {
    return OrderViewMother.random({
      id: command.id,
      sellerId: command.sellerId,
    });
  }
}
