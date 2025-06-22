import { UploadInvoiceCommand } from './UploadInvoiceCommand';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InvoiceId } from '../../../domain/invoice/InvoiceId';
import { OrderId } from '../../../domain/invoice/OrderId';
import { SellerId } from '../../../domain/invoice/SellerId';
import {
  ORDER_VIEW_FINDER,
  OrderViewFinder,
} from '../../../domain/invoice/OrderViewFinder';
import { OrderDoesNotExistsException } from '@app/shared/domain/order/OrderDoesNotExistsException';
import { OrderView } from '../../../domain/invoice/OrderView';
import { InvalidInvoiceFileException } from '../../../domain/invoice/InvalidInvoiceFileException';
import { Inject } from '@nestjs/common';
import { InvoiceAlreadyExistsException } from '../../../domain/invoice/InvoiceAlreadyExistsException';
import {
  INVOICE_REPOSITORY,
  InvoiceRepository,
} from '../../../domain/invoice/InvoiceRepository';
import { Invoice } from '../../../domain/invoice/Invoice';
import {
  FILE_STORAGE,
  FileStorage,
} from '@app/shared/domain/storage/FileStorage';
import { EVENT_BUS, EventBus } from '@app/shared/domain/bus/event-bus/EventBus';

@CommandHandler(UploadInvoiceCommand)
export class UploadInvoiceCommandHandler
  implements ICommandHandler<UploadInvoiceCommand>
{
  constructor(
    @Inject(ORDER_VIEW_FINDER) private readonly orderFinder: OrderViewFinder,
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: InvoiceRepository,
    @Inject(FILE_STORAGE) private readonly fileStorage: FileStorage,
    @Inject(EVENT_BUS) private readonly eventBus: EventBus,
  ) {}

  async execute(command: UploadInvoiceCommand): Promise<void> {
    const id = InvoiceId.of(command.id);
    const orderId = OrderId.of(command.orderId);
    const sellerId = SellerId.of(command.sellerId);
    this.ensureValidInvoiceFile(command.invoiceFile);

    await this.ensureInvoiceDoesNotExist(id);
    await this.ensureOrderExists(orderId, sellerId);

    const filePath = this.fileStorage.upload(
      command.invoiceFile,
      `invoice-${id.toString()}-order-${orderId.toString()}.pdf`,
    );

    const invoice = Invoice.upload(id, orderId, sellerId, filePath);

    await this.invoiceRepository.save(invoice);

    void this.eventBus.publish(invoice.pullDomainEvents());
  }

  ensureValidInvoiceFile(file: string): void {
    if (!file) {
      throw InvalidInvoiceFileException.create();
    }
  }

  private async ensureInvoiceDoesNotExist(invoiceId: InvoiceId): Promise<void> {
    const order = await this.invoiceRepository.findById(invoiceId);
    if (order) {
      throw InvoiceAlreadyExistsException.ofId(invoiceId.toString());
    }
  }

  private async ensureOrderExists(
    orderId: OrderId,
    sellerId: SellerId,
  ): Promise<OrderView> {
    const order = await this.orderFinder.find(orderId, sellerId);
    if (!order) {
      throw new OrderDoesNotExistsException(orderId.toString());
    }

    return order;
  }
}
