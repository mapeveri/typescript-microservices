import { DomainEvent } from './DomainEvent';

export interface EventBus {
  publish(events: DomainEvent[]): Promise<void>;
}

export const EVENT_BUS = Symbol('EventBus');
