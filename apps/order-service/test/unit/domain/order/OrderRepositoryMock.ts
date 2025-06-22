import {
  OrderFilters,
  OrderRepository,
} from '../../../../src/domain/order/OrderRepository';
import { Order } from '../../../../src/domain/order/Order';
import { OrderId } from '../../../../src/domain/order/OrderId';

export class OrderRepositoryMock implements OrderRepository {
  private changed: boolean = false;
  private ordersStored: Order[] = [];
  private toReturn: Order[] = [];

  constructor() {
    this.changed = false;
    this.ordersStored = [];
    this.toReturn = [];
  }

  add(order: Order) {
    return this.toReturn.push(order);
  }

  clean(): void {
    this.toReturn = [];
    this.ordersStored = [];
    this.changed = false;
  }

  storedChanged(): boolean {
    return this.changed;
  }

  stored(): Order[] {
    return this.ordersStored;
  }

  async findById(_id: OrderId): Promise<Order | undefined> {
    return this.toReturn.length > 0
      ? Promise.resolve(this.toReturn[0])
      : Promise.resolve(undefined);
  }

  async findAll(_filters: OrderFilters): Promise<Order[]> {
    return Promise.resolve(this.toReturn);
  }

  async save(order: Order): Promise<void> {
    this.changed = true;
    this.ordersStored.push(order);
    return Promise.resolve();
  }
}
