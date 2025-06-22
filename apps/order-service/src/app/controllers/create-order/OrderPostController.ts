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
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import OrderPostDto from './OrderPostDto';
import CreateOrderCommand from '../../../application/command/create-order/CreateOrderCommand';
import { NestJwtAuthGuard } from '@app/shared/infrastructure/auth/guard/NestJwtAuthGuard';
import { RolesGuard } from '@app/shared/infrastructure/auth/guard/RolesGuard';
import { Roles } from '@app/shared/infrastructure/auth/decorators/Roles';

@ApiTags('Order')
@UseGuards(NestJwtAuthGuard, RolesGuard)
@Controller()
export default class OrderPostController {
  public constructor(private commandBus: CommandBus) {}

  @Post('orders')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The order has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'The ID of the customer making the request',
    required: true,
  })
  @ApiHeader({
    name: 'x-user-role',
    description: 'Customer role',
    required: true,
  })
  @Roles('customer')
  async run(@Body() payload: OrderPostDto, @Req() req: Request): Promise<void> {
    const customerId: string = req.user['id'];

    await this.commandBus.execute(
      new CreateOrderCommand(
        payload.id,
        payload.productId,
        customerId,
        payload.sellerId,
        payload.price,
        payload.quantity,
      ),
    );
  }
}
