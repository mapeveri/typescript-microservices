import { Type } from '@mikro-orm/core';
import { Quantity } from '../../../../domain/order/Quantity';

export class QuantityType extends Type<Quantity, number> {
  convertToDatabaseValue(value: Quantity): number {
    return value.total();
  }

  convertToJSValue(value: number): Quantity {
    return Quantity.fromPrimitives(value);
  }

  getColumnType(): string {
    return 'number';
  }
}
