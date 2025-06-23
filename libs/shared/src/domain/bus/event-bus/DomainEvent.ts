import { Uuid } from '@app/shared/domain/Uuid';

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
        ? Uuid.random().toString()
        : eventId;
    this.occurredOn = occurredOn ?? new Date().toISOString();
  }

  abstract domainEventName(): string;
}
