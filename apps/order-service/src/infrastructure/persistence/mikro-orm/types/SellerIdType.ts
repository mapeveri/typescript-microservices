import { Type } from '@mikro-orm/core';
import { SellerId } from '../../../../domain/order/SellerId';

export class SellerIdType extends Type<SellerId, string> {
  convertToDatabaseValue(value: SellerId): string {
    return value.toString();
  }

  convertToJSValue(value: string): SellerId {
    return SellerId.fromPrimitives(value);
  }

  getColumnType(): string {
    return 'string';
  }
}
