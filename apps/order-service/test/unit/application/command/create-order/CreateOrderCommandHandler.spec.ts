import { beforeEach, beforeAll, describe, expect, it } from 'vitest';
import CreateOrderCommandHandler from '../../../../../src/application/command/create-order/CreateOrderCommandHandler';
import CreateOrderCommand from '../../../../../src/application/command/create-order/CreateOrderCommand';
import { CreateOrderCommandMother } from './CreateOrderCommandMother';
import InvalidArgumentException from '@app/shared/domain/exception/InvalidArgumentException';
import InvalidPriceException from '../../../../../src/domain/order/InvalidPriceException';
import InvalidQuantityException from '../../../../../src/domain/order/InvalidQuantityException';
import { OrderAlreadyExistsException } from '../../../../../src/domain/order/OrderAlreadyExistsException';
import { OrderRepositoryMock } from '../../../domain/order/OrderRepositoryMock';
import { OrderMother } from '../../../domain/order/OrderMother';
import { EventBusMock } from '../../../../../../../libs/shared/test/unit/domain/bus/event-bus/EventBusMock';
import { Order } from '../../../../../src/domain/order/Order';
import { OrderWasCreatedEvent } from '../../../../../src/domain/order/OrderWasCreatedEvent';

describe('Given a CreateOrderCommandHandler to handle', () => {
  let handler: CreateOrderCommandHandler;
  let orderRepository: OrderRepositoryMock;
  let eventBus: EventBusMock;

  const prepareDependencies = () => {
    orderRepository = new OrderRepositoryMock();
    eventBus = new EventBusMock();
  };

  const initHandler = () => {
    handler = new CreateOrderCommandHandler(orderRepository, eventBus);
  };

  const clean = () => {
    orderRepository.clean();
    eventBus.clean();
  };

  beforeAll(() => {
    prepareDependencies();
    initHandler();
  });

  beforeEach(() => {
    clean();
  });

  describe('Given a order with invalid parameters', () => {
    describe('When an ID field is invalid', () => {
      const invalidIdScenarios: Array<[string, Partial<CreateOrderCommand>]> = [
        ['order id', { id: '' }],
        ['product id', { productId: '' }],
        ['customer id', { customerId: '' }],
        ['seller id', { sellerId: '' }],
      ];

      it.each(invalidIdScenarios)(
        'should throw an exception if the %s is invalid',
        async (_label, partialProps) => {
          const command = CreateOrderCommandMother.random(partialProps);

          await expect(handler.execute(command)).rejects.toThrowError(
            InvalidArgumentException,
          );
        },
      );

      it.each(invalidIdScenarios)(
        'should not create the order',
        async (_label, partialProps) => {
          const command = CreateOrderCommandMother.random(partialProps);

          await expect(handler.execute(command)).rejects.toThrowError();

          expect(orderRepository.storedChanged()).toBeFalsy();
          expect(orderRepository.stored()).toHaveLength(0);
        },
      );

      it.each(invalidIdScenarios)(
        'should not publish any event',
        async (_label, partialProps) => {
          const command = CreateOrderCommandMother.random(partialProps);

          await expect(handler.execute(command)).rejects.toThrow();

          expect(eventBus.domainEvents()).toHaveLength(0);
        },
      );
    });

    describe('When the price is invalid', () => {
      let command: CreateOrderCommand;

      function startScenario() {
        command = CreateOrderCommandMother.random({ price: -1 });
      }

      beforeEach(startScenario);

      it('should thrown an exception', async () => {
        await expect(handler.execute(command)).rejects.toThrowError(
          InvalidPriceException,
        );
      });

      it('should not create the order', async () => {
        await expect(handler.execute(command)).rejects.toThrow();

        expect(orderRepository.storedChanged()).toBeFalsy();
        expect(orderRepository.stored()).toHaveLength(0);
      });

      it('should not publish any event', async () => {
        await expect(handler.execute(command)).rejects.toThrow();

        expect(eventBus.domainEvents()).toHaveLength(0);
      });
    });

    describe('When the quantity is invalid', () => {
      let command: CreateOrderCommand;

      function startScenario() {
        command = CreateOrderCommandMother.random({ quantity: -1 });
      }

      beforeEach(startScenario);

      it('should thrown an exception', async () => {
        await expect(handler.execute(command)).rejects.toThrowError(
          InvalidQuantityException,
        );
      });

      it('should not create the order', async () => {
        await expect(handler.execute(command)).rejects.toThrow();

        expect(orderRepository.storedChanged()).toBeFalsy();
        expect(orderRepository.stored()).toHaveLength(0);
      });

      it('should not publish any event', async () => {
        await expect(handler.execute(command)).rejects.toThrow();

        expect(eventBus.domainEvents()).toHaveLength(0);
      });
    });
  });

  describe('Given a order with valid parameters', () => {
    describe('When the order already exists', () => {
      let command: CreateOrderCommand;

      function startScenario() {
        command = CreateOrderCommandMother.random();
        orderRepository.add(OrderMother.random({ id: command.id }));
      }

      beforeEach(startScenario);

      it('should thrown an exception', async () => {
        await expect(handler.execute(command)).rejects.toThrowError(
          OrderAlreadyExistsException,
        );
      });

      it('should not create the order', async () => {
        await expect(handler.execute(command)).rejects.toThrow();

        expect(orderRepository.storedChanged()).toBeFalsy();
        expect(orderRepository.stored()).toHaveLength(0);
      });

      it('should not publish any event', async () => {
        await expect(handler.execute(command)).rejects.toThrow();

        expect(eventBus.domainEvents()).toHaveLength(0);
      });
    });

    describe('When the order does not exists', () => {
      let command: CreateOrderCommand;
      let orderExpected: Order;

      function startScenario() {
        command = CreateOrderCommandMother.random();
        orderExpected = OrderMother.fromCreateOrderCommand(command);
      }

      beforeEach(startScenario);

      it('should persist the order', async () => {
        await handler.execute(command);

        const orderStored = orderRepository.stored();
        expect(orderRepository.storedChanged()).toBeTruthy();
        expect(orderStored).toHaveLength(1);
        expect(orderStored[0].toPrimitives()).toEqual(
          orderExpected.toPrimitives(),
        );
      });

      it('should publish an event', async () => {
        await handler.execute(command);

        expect(eventBus.domainEvents()).toHaveLength(1);
        expect(eventBus.domainEvents()[0]).toBeInstanceOf(OrderWasCreatedEvent);
      });
    });
  });
});
