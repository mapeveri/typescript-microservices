import { Order } from '../../../../src/domain/invoice/Order';
import { OrderFinder } from '../../../../src/domain/invoice/OrderFinder';
import { OrderId } from '../../../../src/domain/invoice/OrderId';
import { SellerId } from '../../../../src/domain/invoice/SellerId';

export class OrderFinderMock implements OrderFinder {
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
