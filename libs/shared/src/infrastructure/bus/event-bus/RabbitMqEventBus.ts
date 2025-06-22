import { EventBus } from '@app/shared/domain/bus/event-bus/EventBus';
import { DomainEvent } from '@app/shared/domain/bus/event-bus/DomainEvent';
import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMqEventBus implements EventBus {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly configService: ConfigService,
  ) {}

  async publish(events: DomainEvent[]): Promise<void> {
    const exchange: string = this.configService.get('RABBITMQ_EXCHANGE')!;

    await Promise.all(
      events.map((event) =>
        this.amqpConnection.publish(
          exchange,
          `${event.domainEventName()}`,
          event,
        ),
      ),
    );
  }
}
