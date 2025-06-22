import { OrderProjectionSubscriber } from './OrderProjectionSubscriber';
import { SendInvoiceSubscriber } from './SendInvoiceSubscriber';

export const subscribers = [OrderProjectionSubscriber, SendInvoiceSubscriber];
