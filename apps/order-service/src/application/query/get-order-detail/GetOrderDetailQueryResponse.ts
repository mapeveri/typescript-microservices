import { OrderPrimitives } from '../../../domain/order/Order';

export class GetOrderDetailQueryResponse {
  constructor(public readonly order: OrderPrimitives) {}
}
