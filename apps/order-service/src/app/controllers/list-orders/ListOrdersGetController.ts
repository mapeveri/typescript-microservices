import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { ListOrdersGetResponse } from './ListOrdersGetResponse';
import { QueryBus } from '@nestjs/cqrs';
import { NestJwtAuthGuard } from '@app/shared/infrastructure/auth/guard/NestJwtAuthGuard';
import { ListOrdersQuery } from '../../../application/query/list-orders/ListOrdersQuery';
import { ListOrdersQueryResponse } from '../../../application/query/list-orders/ListOrdersQueryResponse';
import { RolesGuard } from '@app/shared/infrastructure/auth/guard/RolesGuard';
import { Roles } from '@app/shared/infrastructure/auth/decorators/Roles';
import { Request } from 'express';

@ApiTags('Order')
@Controller()
@UseGuards(NestJwtAuthGuard, RolesGuard)
export default class ListOrdersGetController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('orders')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: [ListOrdersGetResponse] })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'The ID of the seller to list the orders',
    required: true,
  })
  @ApiHeader({
    name: 'x-user-role',
    description: 'Seller role',
    required: true,
  })
  @Roles('seller')
  async run(@Req() req: Request): Promise<ListOrdersGetResponse> {
    const sellerId: string = req.user['id'];

    const response: ListOrdersQueryResponse = await this.queryBus.execute(
      new ListOrdersQuery(sellerId),
    );

    return new ListOrdersGetResponse(response.orders);
  }
}
