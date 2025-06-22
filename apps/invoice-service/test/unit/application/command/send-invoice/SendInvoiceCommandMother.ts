import { SendInvoiceCommand } from '../../../../../src/application/command/send-invoice/SendInvoiceCommand';
import { Invoice } from '../../../../../src/domain/invoice/Invoice';
import { SellerIdMother } from '../../../domain/invoice/SellerIdMother';
import { OrderIdMother } from '../../../domain/invoice/OrderIdMother';

interface SendInvoiceCommandProps {
  orderId?: string;
  sellerId?: string;
  sendAt?: string;
}

export class SendInvoiceCommandMother {
  static random(props?: SendInvoiceCommandProps): SendInvoiceCommand {
    const { orderId, sellerId, sendAt } = props ?? {};

    return new SendInvoiceCommand(
      orderId ?? OrderIdMother.random().toString(),
      sellerId ?? SellerIdMother.random().toString(),
      sendAt ?? new Date().toISOString(),
    );
  }

  static withSendAt(sendAt: string): SendInvoiceCommand {
    return SendInvoiceCommandMother.random({
      sendAt: sendAt,
    });
  }

  static fromInvoiceWithInvalidSeller(invoice: Invoice): SendInvoiceCommand {
    const values = invoice.toPrimitives();
    return SendInvoiceCommandMother.random({
      orderId: values.orderId,
      sellerId: SellerIdMother.random().toString(),
    });
  }
}
