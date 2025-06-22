import { DomainEvent } from '@app/shared/domain/bus/event-bus/DomainEvent';
import { EventBus } from '@app/shared/domain/bus/event-bus/EventBus';

export class EventBusMock implements EventBus {
  private storedEvents: DomainEvent[] = [];

  async publish(events: DomainEvent[]): Promise<void> {
    this.storedEvents.push(...events);
    return Promise.resolve();
  }

  domainEvents(): DomainEvent[] {
    return this.storedEvents;
  }

  clean(): void {
    this.storedEvents = [];
  }
}
