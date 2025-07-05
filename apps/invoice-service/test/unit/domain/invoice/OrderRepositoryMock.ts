import { Order } from '../../../../src/domain/invoice/Order';
import { OrderRepository } from '../../../../src/domain/invoice/OrderRepository';
import { OrderId } from '../../../../src/domain/invoice/OrderId';
import { SellerId } from '../../../../src/domain/invoice/SellerId';

export class OrderRepositoryMock implements OrderRepository {
  private toReturn: Order[] = [];

  constructor() {
    this.toReturn = [];
  }

  add(order: Order): void {
    this.toReturn.push(order);
  }

  clean(): void {
    this.toReturn = [];
  }

  async find(_id: OrderId, _sellerId: SellerId): Promise<Order | undefined> {
    return this.toReturn.length > 0
      ? Promise.resolve(this.toReturn[0])
      : Promise.resolve(undefined);
  }
}
