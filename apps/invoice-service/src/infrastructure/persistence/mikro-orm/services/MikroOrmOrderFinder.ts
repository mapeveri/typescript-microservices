import { Injectable } from '@nestjs/common';
import { OrderFinder } from '../../../../domain/invoice/OrderFinder';
import { OrderId } from '../../../../domain/invoice/OrderId';
import { Order } from '../../../../domain/invoice/Order';
import { SellerId } from '../../../../domain/invoice/SellerId';
import { EntityManager } from '@mikro-orm/mongodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MikroOrmOrderFinder implements OrderFinder {
  constructor(
    private readonly em: EntityManager,
    private readonly configService: ConfigService,
  ) {}

  async find(id: OrderId, sellerId: SellerId): Promise<Order | undefined> {
    const mongoClient = this.em.getDriver().getConnection().getClient();
    const collection = mongoClient
      .db(this.configService.get('INVOICE_SERVICE_DATABASE'))
      .collection('orders');

    const order = await collection.findOne({
      id: id.toString(),
      sellerId: sellerId.toString(),
    });

    if (!order) {
      return undefined;
    }

    return {
      id: order['id'],
      sellerId: order['sellerId'],
      status: order['status'],
    };
  }
}
