import { OrderView } from '../../../../src/domain/invoice/OrderView';
import { OrderViewFinder } from '../../../../src/domain/invoice/OrderViewFinder';
import { OrderId } from '../../../../src/domain/invoice/OrderId';
import { SellerId } from '../../../../src/domain/invoice/SellerId';

export class OrderViewFinderMock implements OrderViewFinder {
  private toReturn: OrderView[] = [];

  constructor() {
    this.toReturn = [];
  }

  add(order: OrderView): void {
    this.toReturn.push(order);
  }

  clean(): void {
    this.toReturn = [];
  }

  async find(
    _id: OrderId,
    _sellerId: SellerId,
  ): Promise<OrderView | undefined> {
    return this.toReturn.length > 0
      ? Promise.resolve(this.toReturn[0])
      : Promise.resolve(undefined);
  }
}
