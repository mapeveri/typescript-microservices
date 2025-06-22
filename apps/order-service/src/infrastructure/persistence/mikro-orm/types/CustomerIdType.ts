import { Type } from '@mikro-orm/core';
import { CustomerId } from '../../../../domain/order/CustomerId';

export class CustomerIdType extends Type<CustomerId, string> {
  convertToDatabaseValue(value: CustomerId): string {
    return value.toString();
  }

  convertToJSValue(value: string): CustomerId {
    return CustomerId.fromPrimitives(value);
  }

  getColumnType(): string {
    return 'string';
  }
}
