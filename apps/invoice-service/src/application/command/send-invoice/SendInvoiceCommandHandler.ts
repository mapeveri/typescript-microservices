import { SendInvoiceCommand } from './SendInvoiceCommand';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  INVOICE_REPOSITORY,
  InvoiceRepository,
} from '../../../domain/invoice/InvoiceRepository';
import { OrderId } from '../../../domain/invoice/OrderId';
import { SellerId } from '../../../domain/invoice/SellerId';
import { EVENT_BUS, EventBus } from '@app/shared/domain/bus/event-bus/EventBus';
import { Invoice } from '../../../domain/invoice/Invoice';
import { InvoiceDoesNotExistsException } from '../../../domain/invoice/InvoiceDoesNotExistsException';

@CommandHandler(SendInvoiceCommand)
export class SendInvoiceCommandHandler
  implements ICommandHandler<SendInvoiceCommand>
{
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: InvoiceRepository,
    @Inject(EVENT_BUS) private readonly eventBus: EventBus,
  ) {}

  async execute(command: SendInvoiceCommand): Promise<void> {
    const orderId = OrderId.of(command.orderId);
    const sellerId = SellerId.of(command.sellerId);

    const invoice = await this.getInvoice(orderId);

    invoice.send(sellerId, command.sendAt);

    await this.invoiceRepository.save(invoice);

    void this.eventBus.publish(invoice.pullDomainEvents());
  }

  private async getInvoice(orderId: OrderId): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findByOrderId(orderId);
    if (!invoice) {
      throw InvoiceDoesNotExistsException.ofOrderId(orderId.toString());
    }

    return invoice;
  }
}
