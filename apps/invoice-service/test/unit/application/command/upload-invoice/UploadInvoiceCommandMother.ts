import { faker } from '@faker-js/faker';
import { UploadInvoiceCommand } from '../../../../../src/application/command/upload-invoice/UploadInvoiceCommand';

interface UploadInvoiceCommandProps {
  id?: string;
  orderId?: string;
  sellerId?: string;
  invoiceFile?: string;
}

export class UploadInvoiceCommandMother {
  static random(props?: UploadInvoiceCommandProps): UploadInvoiceCommand {
    const { id, orderId, sellerId, invoiceFile } = props ?? {};

    return new UploadInvoiceCommand(
      id ?? faker.string.uuid(),
      orderId ?? faker.string.uuid(),
      sellerId ?? faker.string.uuid(),
      invoiceFile ?? faker.string.sample(),
    );
  }

  static withInvalidInvoiceFile() {
    return UploadInvoiceCommandMother.random({ invoiceFile: '' });
  }
}
