import { Order } from '../../../../src/domain/order/Order';
import { OrderIdMother } from './OrderIdMother';
import { ProductIdMother } from './ProductIdMother';
import { CustomerIdMother } from './CustomerIdMother';
import { SellerIdMother } from './SellerIdMother';
import { OrderStatusMother } from './OrderStatusMother';
import { PriceMother } from './PriceMother';
import { QuantityMother } from './QuantityMother';
import CreateOrderCommand from '../../../../src/application/command/create-order/CreateOrderCommand';
import { ChangeOrderStatusCommand } from '../../../../src/application/command/change-order-status/ChangeOrderStatusCommand';
import { faker } from '@faker-js/faker';

interface OrderProps {
  id?: string;
  productId?: string;
  customerId?: string;
  sellerId?: string;
  status?: string;
  price?: number;
  quantity?: number;
}

export class OrderMother {
  static random(props?: OrderProps): Order {
    return new Order(
      props?.id ? OrderIdMother.create(props.id) : OrderIdMother.random(),
      props?.productId
        ? ProductIdMother.create(props.productId)
        : ProductIdMother.random(),
      props?.customerId
        ? CustomerIdMother.create(props.customerId)
        : CustomerIdMother.random(),
      props?.sellerId
        ? SellerIdMother.create(props.sellerId)
        : SellerIdMother.random(),
      props?.status
        ? OrderStatusMother.create(props.status)
        : OrderStatusMother.random(),
      props?.price ? PriceMother.create(props.price) : PriceMother.random(),
      props?.quantity
        ? QuantityMother.create(props.quantity)
        : QuantityMother.random(),
    );
  }

  static withOrderStatusCreated(): Order {
    return OrderMother.random({
      id: OrderIdMother.random().toString(),
      productId: ProductIdMother.random().toString(),
      customerId: CustomerIdMother.random().toString(),
      sellerId: SellerIdMother.random().toString(),
      status: OrderStatusMother.created().toString(),
      price: PriceMother.random().amount(),
      quantity: QuantityMother.random().total(),
    });
  }

  static fromCreateOrderCommand(command: CreateOrderCommand): Order {
    return OrderMother.random({
      id: OrderIdMother.create(command.id).toString(),
      productId: ProductIdMother.create(command.productId).toString(),
      customerId: CustomerIdMother.create(command.customerId).toString(),
      sellerId: SellerIdMother.create(command.sellerId).toString(),
      status: OrderStatusMother.created().toString(),
      price: PriceMother.create(command.price).amount(),
      quantity: QuantityMother.create(command.quantity).total(),
    });
  }

  static fromChangeOrderStatusCommandWithExternalSeller(
    command: ChangeOrderStatusCommand,
  ): Order {
    return OrderMother.random({
      id: command.id,
      sellerId: faker.string.uuid(),
      status: command.status,
    });
  }

  static fromChangeOrderStatusCommandWithOrderStatusCreated(
    command: ChangeOrderStatusCommand,
  ): Order {
    return OrderMother.random({
      id: command.id,
      sellerId: command.sellerId,
      status: OrderStatusMother.created().toString(),
    });
  }
}
