import { Invoice } from '../../../../src/domain/invoice/Invoice';
import { InvoiceIdMother } from './InvoiceIdMother';
import { UploadInvoiceCommand } from '../../../../src/application/command/upload-invoice/UploadInvoiceCommand';
import { OrderIdMother } from './OrderIdMother';
import { SellerIdMother } from './SellerIdMother';
import { faker } from '@faker-js/faker';
import { SendInvoiceCommand } from '../../../../src/application/command/send-invoice/SendInvoiceCommand';

interface InvoiceProps {
  id?: string;
  orderId?: string;
  sellerId?: string;
  filePath?: string;
  sentAt?: string;
}

export class InvoiceMother {
  static random(props?: InvoiceProps): Invoice {
    return new Invoice(
      props?.id ? InvoiceIdMother.create(props.id) : InvoiceIdMother.random(),
      props?.orderId
        ? OrderIdMother.create(props.orderId)
        : OrderIdMother.random(),
      props?.sellerId
        ? SellerIdMother.create(props.sellerId)
        : SellerIdMother.random(),
      props?.filePath ?? faker.word.words(),
      props?.sentAt === undefined ? undefined : new Date(props.sentAt),
    );
  }

  static fromSendInvoiceCommand(command: SendInvoiceCommand): Invoice {
    return InvoiceMother.random({
      orderId: command.orderId,
      sellerId: command.sellerId,
      sentAt: command.sendAt,
    });
  }

  static fromSendInvoiceCommandWithoutSentAt(
    command: SendInvoiceCommand,
  ): Invoice {
    return InvoiceMother.random({
      orderId: command.orderId,
      sellerId: command.sellerId,
      sentAt: undefined,
    });
  }

  static fromUploadInvoiceCommand(command: UploadInvoiceCommand): Invoice {
    return InvoiceMother.random({
      id: command.id,
      orderId: command.orderId,
      sellerId: command.sellerId,
      filePath: command.invoiceFile,
      sentAt: undefined,
    });
  }
}
