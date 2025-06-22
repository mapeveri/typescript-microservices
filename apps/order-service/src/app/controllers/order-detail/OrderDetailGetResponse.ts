import { ApiProperty } from '@nestjs/swagger';

export class OrderDetailGetResponseItem {
  @ApiProperty({
    description: 'The order ID',
    example: '00000000-0000-0000-0000-000000000000\n',
  })
  id: string;

  @ApiProperty({
    description: 'Product ID',
    example: '00000000-0000-0000-0000-000000000000\n',
  })
  productId: string;

  @ApiProperty({ description: 'Product quantity', example: 1 })
  quantity: number;

  @ApiProperty({ description: 'Product price', example: 50.2 })
  price: number;

  @ApiProperty({
    description: 'Customer ID',
    example: '00000000-0000-0000-0000-000000000000\n',
  })
  customerId: string;

  @ApiProperty({
    description: 'Seller ID',
    example: '00000000-0000-0000-0000-000000000000\n',
  })
  sellerId: string;

  @ApiProperty({ description: 'Order status', example: 'CREATED' })
  status: string;
}

export class OrderDetailGetResponse {
  @ApiProperty({
    description: 'Order detail',
    type: [OrderDetailGetResponseItem],
  })
  order: OrderDetailGetResponseItem;

  constructor(order: OrderDetailGetResponseItem) {
    this.order = order;
  }
}
