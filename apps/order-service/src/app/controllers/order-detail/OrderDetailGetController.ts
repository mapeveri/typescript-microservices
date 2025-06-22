import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { NestJwtAuthGuard } from '@app/shared/infrastructure/auth/guard/NestJwtAuthGuard';
import { OrderDetailGetResponse } from './OrderDetailGetResponse';
import { GetOrderDetailQuery } from '../../../application/query/get-order-detail/GetOrderDetailQuery';
import { GetOrderDetailQueryResponse } from '../../../application/query/get-order-detail/GetOrderDetailQueryResponse';
import { RolesGuard } from '@app/shared/infrastructure/auth/guard/RolesGuard';
import { Roles } from '@app/shared/infrastructure/auth/decorators/Roles';
import { Request } from 'express';

@ApiTags('Order')
@Controller()
@UseGuards(NestJwtAuthGuard, RolesGuard)
export default class OrderDetailGetController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('orders/:orderId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: [OrderDetailGetResponse] })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'The ID of the seller to get the order',
    required: true,
  })
  @ApiHeader({
    name: 'x-user-role',
    description: 'Seller role',
    required: true,
  })
  @Roles('seller')
  async run(
    @Param('orderId') orderId: string,
    @Req() req: Request,
  ): Promise<OrderDetailGetResponse> {
    const sellerId: string = req.user['id'];

    const response: GetOrderDetailQueryResponse = await this.queryBus.execute(
      new GetOrderDetailQuery(orderId, sellerId),
    );

    return new OrderDetailGetResponse(response.order);
  }
}
