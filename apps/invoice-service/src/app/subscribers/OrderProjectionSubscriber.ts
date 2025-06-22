import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import * as process from 'node:process';
import { EntityManager } from '@mikro-orm/mongodb';
import { DomainEvent } from '@app/shared/domain/bus/event-bus/DomainEvent';
import { ConfigService } from '@nestjs/config';

const EXCHANGE = process.env.RABBITMQ_EXCHANGE!;
const QUEUE = process.env.RABBITMQ_ORDER_PROJECTION_QUEUE!;

@Injectable()
export class OrderProjectionSubscriber {
  constructor(
    private readonly em: EntityManager,
    private readonly configService: ConfigService,
  ) {}

  @RabbitSubscribe({
    exchange: EXCHANGE,
    routingKey: 'order.*',
    queue: QUEUE,
  })
  public async handlerProjection(message: DomainEvent): Promise<void> {
    console.log(
      `[OrderProjectionSubscriber]: Received message: ${JSON.stringify(message)}`,
    );

    const mongoClient = this.em.getDriver().getConnection().getClient();
    const collection = mongoClient
      .db(this.configService.get('INVOICE_SERVICE_DATABASE'))
      .collection('orders');

    const update: Record<string, unknown> = {
      id: message.aggregateId,
      status: message['status'],
    };

    if (message['sellerId']) {
      update['sellerId'] = message['sellerId'];
    }

    await collection.updateOne(
      { id: message.aggregateId },
      { $set: update },
      { upsert: true },
    );
  }
}
