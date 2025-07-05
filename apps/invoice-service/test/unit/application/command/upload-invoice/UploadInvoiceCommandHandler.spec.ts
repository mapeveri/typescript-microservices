import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { UploadInvoiceCommandHandler } from '../../../../../src/application/command/upload-invoice/UploadInvoiceCommandHandler';
import InvalidArgumentException from '@app/shared/domain/exception/InvalidArgumentException';
import { UploadInvoiceCommand } from '../../../../../src/application/command/upload-invoice/UploadInvoiceCommand';
import { UploadInvoiceCommandMother } from './UploadInvoiceCommandMother';
import { OrderDoesNotExistsException } from '@app/shared/domain/order/OrderDoesNotExistsException';
import { OrderRepositoryMock } from '../../../domain/invoice/OrderRepositoryMock';
import { InvalidInvoiceFileException } from '../../../../../src/domain/invoice/InvalidInvoiceFileException';
import { InvoiceAlreadyExistsException } from '../../../../../src/domain/invoice/InvoiceAlreadyExistsException';
import { InvoiceRepositoryMock } from '../../../domain/invoice/InvoiceRepositoryMock';
import { OrderMother } from '../../../domain/invoice/OrderMother';
import { InvoiceMother } from '../../../domain/invoice/InvoiceMother';
import { Invoice } from '../../../../../src/domain/invoice/Invoice';
import { FileStorageMock } from '../../../../../../../libs/shared/test/unit/domain/storage/FileStorageMock';
import { EventBusMock } from '../../../../../../../libs/shared/test/unit/domain/bus/event-bus/EventBusMock';
import { InvoiceWasUploadedEvent } from '../../../../../src/domain/invoice/InvoiceWasUploadedEvent';

describe('Given a CreateOrderCommandHandler to handle', () => {
  let handler: UploadInvoiceCommandHandler;
  let orderRepository: OrderRepositoryMock;
  let invoiceRepository: InvoiceRepositoryMock;
  let fileStorage: FileStorageMock;
  let eventBus: EventBusMock;

  const prepareDependencies = () => {
    orderRepository = new OrderRepositoryMock();
    invoiceRepository = new InvoiceRepositoryMock();
    fileStorage = new FileStorageMock();
    eventBus = new EventBusMock();
  };

  const initHandler = () => {
    handler = new UploadInvoiceCommandHandler(
      orderRepository,
      invoiceRepository,
      fileStorage,
      eventBus,
    );
  };

  const clean = () => {
    orderRepository.clean();
    invoiceRepository.clean();
    fileStorage.clean();
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
      const invalidIdScenarios: Array<[string, Partial<UploadInvoiceCommand>]> =
        [
          ['invoice id', { id: '' }],
          ['order id', { orderId: '' }],
          ['seller id', { sellerId: '' }],
        ];

      it.each(invalidIdScenarios)(
        'should throw an exception if the %s is invalid',
        async (_label, partialProps) => {
          const command = UploadInvoiceCommandMother.random(partialProps);

          await expect(handler.execute(command)).rejects.toThrowError(
            InvalidArgumentException,
          );
        },
      );

      it.each(invalidIdScenarios)(
        'should not upload the invoice',
        async (_label, partialProps) => {
          const command = UploadInvoiceCommandMother.random(partialProps);

          await expect(handler.execute(command)).rejects.toThrow();

          expect(invoiceRepository.storedChanged()).toBeFalsy();
          expect(invoiceRepository.stored()).toHaveLength(0);
        },
      );

      it.each(invalidIdScenarios)(
        'should not publish any event',
        async (_label, partialProps) => {
          const command = UploadInvoiceCommandMother.random(partialProps);

          await expect(handler.execute(command)).rejects.toThrow();

          expect(eventBus.domainEvents()).toHaveLength(0);
        },
      );
    });

    describe('When the invoice file is invalid', () => {
      let command: UploadInvoiceCommand;

      function startScenario() {
        command = UploadInvoiceCommandMother.withInvalidInvoiceFile();
      }

      beforeEach(startScenario);

      it('should thrown an exception', async () => {
        await expect(handler.execute(command)).rejects.toThrowError(
          InvalidInvoiceFileException,
        );
      });

      it('should not upload the invoice', async () => {
        await expect(handler.execute(command)).rejects.toThrow();

        expect(invoiceRepository.storedChanged()).toBeFalsy();
        expect(invoiceRepository.stored()).toHaveLength(0);
      });

      it('should not publish any event', async () => {
        await expect(handler.execute(command)).rejects.toThrow();

        expect(eventBus.domainEvents()).toHaveLength(0);
      });
    });
  });

  describe('Given a invoice with valid parameters', () => {
    describe('When the invoice already exists', () => {
      let command: UploadInvoiceCommand;

      function startScenario() {
        command = UploadInvoiceCommandMother.random();
        const invoice = InvoiceMother.fromUploadInvoiceCommand(command);
        invoiceRepository.add(invoice);
      }

      beforeEach(startScenario);

      it('should thrown an exception', async () => {
        await expect(handler.execute(command)).rejects.toThrowError(
          InvoiceAlreadyExistsException,
        );
      });

      it('should not upload the invoice', async () => {
        await expect(handler.execute(command)).rejects.toThrow();

        expect(invoiceRepository.storedChanged()).toBeFalsy();
        expect(invoiceRepository.stored()).toHaveLength(0);
      });

      it('should not publish any event', async () => {
        await expect(handler.execute(command)).rejects.toThrow();

        expect(eventBus.domainEvents()).toHaveLength(0);
      });
    });

    describe('When the order does not exists', () => {
      let command: UploadInvoiceCommand;

      function startScenario() {
        command = UploadInvoiceCommandMother.random();
      }

      beforeEach(startScenario);

      it('should thrown an exception', async () => {
        await expect(handler.execute(command)).rejects.toThrowError(
          OrderDoesNotExistsException,
        );
      });

      it('should not upload the invoice', async () => {
        await expect(handler.execute(command)).rejects.toThrow();

        expect(invoiceRepository.storedChanged()).toBeFalsy();
        expect(invoiceRepository.stored()).toHaveLength(0);
      });

      it('should not publish any event', async () => {
        await expect(handler.execute(command)).rejects.toThrow();

        expect(eventBus.domainEvents()).toHaveLength(0);
      });
    });

    describe('When the order does exists and the invoice does not exists', () => {
      let command: UploadInvoiceCommand;
      let invoiceExpected: Invoice;

      function startScenario() {
        command = UploadInvoiceCommandMother.random();
        const order = OrderMother.fromUploadInvoiceCommand(command);
        invoiceExpected = InvoiceMother.fromUploadInvoiceCommand(command);

        orderRepository.add(order);
        fileStorage.add(command.invoiceFile);
      }

      beforeEach(startScenario);

      it('should persist the invoice', async () => {
        await handler.execute(command);

        const invoiceStored = invoiceRepository.stored();
        expect(invoiceRepository.storedChanged()).toBeTruthy();
        expect(invoiceStored).toHaveLength(1);
        expect(invoiceStored[0].toPrimitives()).toEqual(
          invoiceExpected.toPrimitives(),
        );
      });

      it('should publish an event', async () => {
        await handler.execute(command);

        expect(eventBus.domainEvents()).toHaveLength(1);
        expect(eventBus.domainEvents()[0]).toBeInstanceOf(
          InvoiceWasUploadedEvent,
        );
      });
    });
  });
});
