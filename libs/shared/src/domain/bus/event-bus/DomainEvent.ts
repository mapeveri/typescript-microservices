import * as crypto from 'node:crypto';

export abstract class DomainEvent {
  public readonly aggregateId: string;
  public readonly eventId: string;
  public readonly occurredOn: string;

  constructor(
    aggregateId: string,
    eventId: string | null = null,
    occurredOn: string | null = null,
  ) {
    this.aggregateId = aggregateId;
    this.eventId =
      eventId === null || eventId === undefined || eventId.trim() === ''
        ? crypto.randomUUID()
        : eventId;
    this.occurredOn =
      occurredOn ?? new Date().toISOString().replace('T', ' ').split('.')[0];
  }

  abstract domainEventName(): string;
}
