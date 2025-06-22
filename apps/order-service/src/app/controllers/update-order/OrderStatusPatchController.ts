import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { NestJwtAuthGuard } from '@app/shared/infrastructure/auth/guard/NestJwtAuthGuard';
import { RolesGuard } from '@app/shared/infrastructure/auth/guard/RolesGuard';
import { Roles } from '@app/shared/infrastructure/auth/decorators/Roles';
import OrderStatusPatchDto from './OrderStatusPatchDto';
import { ChangeOrderStatusCommand } from '../../../application/command/change-order-status/ChangeOrderStatusCommand';

@ApiTags('Order')
@UseGuards(NestJwtAuthGuard, RolesGuard)
@Controller()
export default class OrderStatusPatchController {
  public constructor(private commandBus: CommandBus) {}

  @Patch('orders/:orderId')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'The order has been successfully updated.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'The ID of the seller making the request',
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
    @Body() payload: OrderStatusPatchDto,
    @Req() req: Request,
  ): Promise<void> {
    const sellerId: string = req.user['id'];

    await this.commandBus.execute(
      new ChangeOrderStatusCommand(orderId, sellerId, payload.status),
    );
  }
}
