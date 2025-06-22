import { EVENT_BUS } from '@app/shared/domain/bus/event-bus/EventBus';
import { RabbitMqEventBus } from '@app/shared/infrastructure/bus/event-bus/RabbitMqEventBus';

export const buses = [
  {
    provide: EVENT_BUS,
    useClass: RabbitMqEventBus,
  },
];
