import * as crypto from 'node:crypto';
import InvalidArgumentException from './exception/InvalidArgumentException';

export class Uuid {
  protected constructor(protected readonly value: string) {}

  static fromPrimitives(value: string): Uuid {
    return new this(value);
  }

  static of(value: string): Uuid {
    const instance = new this(value);
    instance.validateUuid(value);
    return instance;
  }

  static random(): Uuid {
    return new Uuid(crypto.randomUUID());
  }

  toString(): string {
    return this.value;
  }

  equals(other: Uuid): boolean {
    return other.value === this.value;
  }

  private validateUuid(id: string): void {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
      throw new InvalidArgumentException(
        `<${this.constructor.name}> does not allow the value <${id}>`,
      );
    }
  }
}
