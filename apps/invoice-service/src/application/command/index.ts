import { UploadInvoiceCommandHandler } from './upload-invoice/UploadInvoiceCommandHandler';
import { SendInvoiceCommandHandler } from './send-invoice/SendInvoiceCommandHandler';

export const commands = [
  UploadInvoiceCommandHandler,
  SendInvoiceCommandHandler,
];
