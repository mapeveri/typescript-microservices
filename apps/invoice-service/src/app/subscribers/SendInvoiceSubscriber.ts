import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import * as process from 'node:process';
import { DomainEvent } from '@app/shared/domain/bus/event-bus/DomainEvent';
import { CommandBus } from '@nestjs/cqrs';
import { OrderStatusType } from '@app/shared/domain/order/OrderStatusType';
import { SendInvoiceCommand } from '../../application/command/send-invoice/SendInvoiceCommand';

const EXCHANGE = process.env.RABBITMQ_EXCHANGE!;
const QUEUE = process.env.RABBITMQ_SEND_INVOICE_QUEUE!;

@Injectable()
export class SendInvoiceSubscriber {
  constructor(private readonly commandBus: CommandBus) {}

  @RabbitSubscribe({
    exchange: EXCHANGE,
    routingKey: 'order.OrderStatusWasChangedEvent',
    queue: QUEUE,
  })
  public async handlerProjection(message: DomainEvent): Promise<void> {
    console.log(
      `[SendInvoiceSubscriber]: Received message: ${JSON.stringify(message)}`,
    );

    if (message['status'] !== OrderStatusType.SHIPPED) {
      return;
    }

    const orderId = message.aggregateId;
    const sellerId: string = message['sellerId'];

    await this.commandBus.execute(
      new SendInvoiceCommand(orderId, sellerId, new Date().toISOString()),
    );
  }
}
