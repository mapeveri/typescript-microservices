import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { InvoiceRepositoryMock } from '../../../domain/invoice/InvoiceRepositoryMock';
import { SendInvoiceCommandHandler } from '../../../../../src/application/command/send-invoice/SendInvoiceCommandHandler';
import InvalidArgumentException from '@app/shared/domain/exception/InvalidArgumentException';
import { SendInvoiceCommand } from '../../../../../src/application/command/send-invoice/SendInvoiceCommand';
import { SendInvoiceCommandMother } from './SendInvoiceCommandMother';
import { EventBusMock } from '../../../../../../../libs/shared/test/unit/domain/bus/event-bus/EventBusMock';
import { InvoiceDoesNotExistsException } from '../../../../../src/domain/invoice/InvoiceDoesNotExistsException';
import { InvoiceMother } from '../../../domain/invoice/InvoiceMother';
import { InvoiceSellerForbiddenException } from '../../../../../src/domain/invoice/InvoiceSellerForbiddenException';
import { InvoiceWasSentEvent } from '../../../../../src/domain/invoice/InvoiceWasSentEvent';
import { Invoice } from '../../../../../src/domain/invoice/Invoice';

describe('Given a SendInvoiceCommandHandler to handle', () => {
  let handler: SendInvoiceCommandHandler;
  let invoiceRepository: InvoiceRepositoryMock;
  let eventBus: EventBusMock;

  const prepareDependencies = () => {
    invoiceRepository = new InvoiceRepositoryMock();
    eventBus = new EventBusMock();
  };

  const initHandler = () => {
    handler = new SendInvoiceCommandHandler(invoiceRepository, eventBus);
  };

  const clean = () => {
    invoiceRepository.clean();
    eventBus.clean();
  };

  beforeAll(() => {
    prepareDependencies();
    initHandler();
  });

  beforeEach(() => {
    clean();
  });

  describe('Given a invoice with invalid parameters', () => {
    describe('When an ID field is invalid', () => {
      const invalidIdScenarios: Array<[string, Partial<SendInvoiceCommand>]> = [
        ['order id', { orderId: '' }],
        ['seller id', { sellerId: '' }],
      ];

      it.each(invalidIdScenarios)(
        'should throw an exception if the %s is invalid',
        async (_label, partialProps) => {
          const command = SendInvoiceCommandMother.random(partialProps);

          await expect(handler.execute(command)).rejects.toThrowError(
            InvalidArgumentException,
          );
        },
      );
    });
  });

  describe('Given a invoice with valid parameters', () => {
    describe('When the invoice does not exists', () => {
      let command: SendInvoiceCommand;

      function startScenario() {
        command = SendInvoiceCommandMother.random();
      }

      beforeEach(startScenario);

      it('should thrown an exception', async () => {
        await expect(handler.execute(command)).rejects.toThrowError(
          InvoiceDoesNotExistsException,
        );
      });

      it('should not send the invoice', async () => {
        await expect(handler.execute(command)).rejects.toThrow();

        expect(invoiceRepository.storedChanged()).toBeFalsy();
        expect(invoiceRepository.stored()).toHaveLength(0);
      });

      it('should not publish any event', async () => {
        await expect(handler.execute(command)).rejects.toThrow();

        expect(eventBus.domainEvents()).toHaveLength(0);
      });
    });

    describe('When the invoice has an invalid seller', () => {
      let command: SendInvoiceCommand;

      function startScenario() {
        const invoice = InvoiceMother.random();
        command =
          SendInvoiceCommandMother.fromInvoiceWithInvalidSeller(invoice);
        invoiceRepository.add(invoice);
      }

      beforeEach(startScenario);

      it('should thrown an exception', async () => {
        await expect(handler.execute(command)).rejects.toThrowError(
          InvoiceSellerForbiddenException,
        );
      });

      it('should not send the invoice', async () => {
        await expect(handler.execute(command)).rejects.toThrow();

        expect(invoiceRepository.storedChanged()).toBeFalsy();
        expect(invoiceRepository.stored()).toHaveLength(0);
      });

      it('should not publish any event', async () => {
        await expect(handler.execute(command)).rejects.toThrow();

        expect(eventBus.domainEvents()).toHaveLength(0);
      });
    });

    describe('When the invoice was already shipped', () => {
      let command: SendInvoiceCommand;
      let sentAtExpected: string | undefined;

      function startScenario() {
        sentAtExpected = new Date().toISOString();
        command = SendInvoiceCommandMother.withSendAt(sentAtExpected);
        const invoice = InvoiceMother.fromSendInvoiceCommand(command);

        invoiceRepository.add(invoice);
      }

      beforeEach(startScenario);

      it('should not send the invoice', async () => {
        await handler.execute(command);

        const invoiceStored = invoiceRepository.stored();
        expect(invoiceRepository.storedChanged()).toBeTruthy();
        expect(invoiceStored).toHaveLength(1);
        expect(invoiceStored[0].toPrimitives().sentAt).toEqual(sentAtExpected);
      });

      it('should not publish any event', async () => {
        await handler.execute(command);

        expect(eventBus.domainEvents()).toHaveLength(0);
      });
    });

    describe('When the invoice is ready to be sent', () => {
      let command: SendInvoiceCommand;
      let invoiceExpected: Invoice;
      let sentAtExpected: string | undefined;

      function startScenario() {
        sentAtExpected = new Date().toISOString();
        command = SendInvoiceCommandMother.withSendAt(sentAtExpected);
        invoiceExpected =
          InvoiceMother.fromSendInvoiceCommandWithoutSentAt(command);

        invoiceRepository.add(
          InvoiceMother.random(invoiceExpected.toPrimitives()),
        );
      }

      beforeEach(startScenario);

      it('should send the invoice', async () => {
        await handler.execute(command);

        const invoiceStored = invoiceRepository.stored();
        expect(invoiceRepository.storedChanged()).toBeTruthy();
        expect(invoiceStored).toHaveLength(1);
        expect(invoiceStored[0].toPrimitives().sentAt).toEqual(sentAtExpected);

        expect(invoiceStored[0].toPrimitives()).toEqual({
          ...invoiceExpected.toPrimitives(),
          sentAt: sentAtExpected,
        });
      });

      it('should publish an event', async () => {
        await handler.execute(command);

        expect(eventBus.domainEvents()).toHaveLength(1);
        expect(eventBus.domainEvents()[0]).toBeInstanceOf(InvoiceWasSentEvent);
      });
    });
  });
});
