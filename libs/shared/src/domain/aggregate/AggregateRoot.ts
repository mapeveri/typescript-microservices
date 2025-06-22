import { DomainEvent } from '../bus/event-bus/DomainEvent';

export abstract class AggregateRoot {
  protected domainEvents: DomainEvent[] = [];

  protected constructor() {
    this.domainEvents = [];
  }

  pullDomainEvents(): DomainEvent[] {
    const domainEvents = this.domainEvents || [];
    this.domainEvents = [];
    return domainEvents;
  }

  record(domainEvent: DomainEvent): void {
    if (!this.domainEvents) {
      this.domainEvents = [];
    }

    this.domainEvents.push(domainEvent);
  }
}
