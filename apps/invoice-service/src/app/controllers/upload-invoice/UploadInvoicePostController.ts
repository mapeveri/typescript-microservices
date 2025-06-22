import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Express } from 'express';
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NestJwtAuthGuard } from '@app/shared/infrastructure/auth/guard/NestJwtAuthGuard';
import { RolesGuard } from '@app/shared/infrastructure/auth/guard/RolesGuard';
import { CommandBus } from '@nestjs/cqrs';
import { Roles } from '@app/shared/infrastructure/auth/decorators/Roles';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadInvoiceCommand } from '../../../application/command/upload-invoice/UploadInvoiceCommand';

@ApiTags('Invoice')
@UseGuards(NestJwtAuthGuard, RolesGuard)
@Controller()
export default class UploadInvoicePostController {
  constructor(private commandBus: CommandBus) {}

  @Post('orders/:orderId/invoices/:invoiceId')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The invoice has been successfully uploaded.',
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Roles('seller')
  async run(
    @Param('invoiceId') invoiceId: string,
    @Param('orderId') orderId: string,
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<void> {
    const sellerId: string = req.user['id'];

    if (!file) {
      throw new BadRequestException();
    }

    await this.commandBus.execute(
      new UploadInvoiceCommand(
        invoiceId,
        orderId,
        sellerId,
        file.buffer.toString('base64'),
      ),
    );
  }
}
