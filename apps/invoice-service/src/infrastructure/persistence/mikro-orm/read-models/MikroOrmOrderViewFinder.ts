import { Injectable } from '@nestjs/common';
import { OrderViewFinder } from '../../../../domain/invoice/OrderViewFinder';
import { OrderId } from '../../../../domain/invoice/OrderId';
import { OrderView } from '../../../../domain/invoice/OrderView';
import { SellerId } from '../../../../domain/invoice/SellerId';
import { EntityManager } from '@mikro-orm/mongodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MikroOrmOrderViewFinder implements OrderViewFinder {
  constructor(
    private readonly em: EntityManager,
    private readonly configService: ConfigService,
  ) {}

  async find(id: OrderId, sellerId: SellerId): Promise<OrderView | undefined> {
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
