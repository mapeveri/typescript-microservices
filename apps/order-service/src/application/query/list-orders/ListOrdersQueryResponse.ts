import { OrderPrimitives } from '../../../domain/order/Order';

export class ListOrdersQueryResponse {
  constructor(public readonly orders: OrderPrimitives[]) {}
}
