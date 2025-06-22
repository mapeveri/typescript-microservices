import { Type } from '@mikro-orm/core';
import { Price } from '../../../../domain/order/Price';

export class PriceType extends Type<Price, number> {
  convertToDatabaseValue(value: Price): number {
    return value.amount();
  }

  convertToJSValue(value: number): Price {
    return Price.fromPrimitives(value);
  }

  getColumnType(): string {
    return 'number';
  }
}
