import { Type } from '@mikro-orm/core';
import { ProductId } from '../../../../domain/order/ProductId';

export class ProductIdType extends Type<ProductId, string> {
  convertToDatabaseValue(value: ProductId): string {
    return value.toString();
  }

  convertToJSValue(value: string): ProductId {
    return ProductId.fromPrimitives(value);
  }

  getColumnType(): string {
    return 'string';
  }
}
