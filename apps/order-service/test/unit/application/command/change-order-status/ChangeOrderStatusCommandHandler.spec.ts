import { beforeEach, beforeAll, describe, expect, it } from 'vitest';
import { OrderRepositoryMock } from '../../../domain/order/OrderRepositoryMock';
import { EventBusMock } from '../../../../../../../libs/shared/test/unit/domain/bus/event-bus/EventBusMock';
import InvalidArgumentException from '@app/shared/domain/exception/InvalidArgumentException';
import { OrderMother } from '../../../domain/order/OrderMother';
import { Order } from '../../../../../src/domain/order/Order';
import { ChangeOrderStatusCommandHandler } from '../../../../../src/application/command/change-order-status/ChangeOrderStatusCommandHandler';
import { ChangeOrderStatusCommand } from '../../../../../src/application/command/change-order-status/ChangeOrderStatusCommand';
import { ChangeOrderStatusCommandMother } from './ChangeOrderStatusCommandMother';
import InvalidOrderStatusException from '../../../../../src/domain/order/InvalidOrderStatusException';
import { OrderDoesNotExistsException } from '@app/shared/domain/order/OrderDoesNotExistsException';
import { OrderSellerForbiddenException } from '../../../../../src/domain/order/OrderSellerForbiddenException';
import { OrderStatusWasChangedEvent } from '../../../../../src/domain/order/OrderStatusWasChangedEvent';
import { OrderStatusMother } from '../../../domain/order/OrderStatusMother';

describe('Given a ChangeOrderStatusCommandHandler to handle', () => {
  let handler: ChangeOrderStatusCommandHandler;
  let orderRepository: OrderRepositoryMock;
  let eventBus: EventBusMock;

  const prepareDependencies = () => {
    orderRepository = new OrderRepositoryMock();
    eventBus = new EventBusMock();
  };

  const initHandler = () => {
    handler = new ChangeOrderStatusCommandHandler(orderRepository, eventBus);
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
      const invalidIdScenarios: Array<
        [string, Partial<ChangeOrderStatusCommand>]
      > = [
        ['order id', { id: '' }],
        ['seller id', { sellerId: '' }],
      ];

      it.each(invalidIdScenarios)(
        'should throw an exception if the %s is invalid',
        async (_label, partialProps) => {
          const command = ChangeOrderStatusCommandMother.random(partialProps);

          await expect(handler.execute(command)).rejects.toThrowError(
            InvalidArgumentException,
          );
        },
      );

      it.each(invalidIdScenarios)(
        'should not change the order',
        async (_label, partialProps) => {
          const command = ChangeOrderStatusCommandMother.random(partialProps);

          await expect(handler.execute(command)).rejects.toThrow();

          expect(orderRepository.storedChanged()).toBeFalsy();
          expect(orderRepository.stored()).toHaveLength(0);
        },
      );

      it.each(invalidIdScenarios)(
        'should not publish any event',
        async (_label, partialProps) => {
          const command = ChangeOrderStatusCommandMother.random(partialProps);

          await expect(handler.execute(command)).rejects.toThrow();

          expect(eventBus.domainEvents()).toHaveLength(0);
        },
      );
    });

    describe('When the status is invalid', () => {
      let command: ChangeOrderStatusCommand;

      function startScenario() {
        command = ChangeOrderStatusCommandMother.random({ status: '' });
      }

      beforeEach(startScenario);

      it('should thrown an exception', async () => {
        await expect(handler.execute(command)).rejects.toThrowError(
          InvalidOrderStatusException,
        );
      });

      it('should not change the order', async () => {
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
    describe('When the order does not exists', () => {
      let command: ChangeOrderStatusCommand;

      function startScenario() {
        command = ChangeOrderStatusCommandMother.random();
      }

      beforeEach(startScenario);

      it('should thrown an exception', async () => {
        await expect(handler.execute(command)).rejects.toThrowError(
          OrderDoesNotExistsException,
        );
      });

      it('should not change the order', async () => {
        await expect(handler.execute(command)).rejects.toThrow();

        expect(orderRepository.storedChanged()).toBeFalsy();
        expect(orderRepository.stored()).toHaveLength(0);
      });

      it('should not publish any event', async () => {
        await expect(handler.execute(command)).rejects.toThrow();

        expect(eventBus.domainEvents()).toHaveLength(0);
      });
    });

    describe('When an external seller is trying to update the status', () => {
      let command: ChangeOrderStatusCommand;

      function startScenario() {
        command = ChangeOrderStatusCommandMother.random();
        const order =
          OrderMother.fromChangeOrderStatusCommandWithExternalSeller(command);
        orderRepository.add(order);
      }

      beforeEach(startScenario);

      it('should thrown an exception', async () => {
        await expect(handler.execute(command)).rejects.toThrowError(
          OrderSellerForbiddenException,
        );
      });

      it('should not change the order', async () => {
        await expect(handler.execute(command)).rejects.toThrow();

        expect(orderRepository.storedChanged()).toBeFalsy();
        expect(orderRepository.stored()).toHaveLength(0);
      });

      it('should not publish any event', async () => {
        await expect(handler.execute(command)).rejects.toThrow();

        expect(eventBus.domainEvents()).toHaveLength(0);
      });
    });

    describe('When the seller trying to change the same status', () => {
      let command: ChangeOrderStatusCommand;
      let orderExpected: Order;
      let statusExpected: string;

      function startScenario() {
        orderExpected = OrderMother.withOrderStatusCreated();
        statusExpected = OrderStatusMother.created().toString();
        command = ChangeOrderStatusCommandMother.fromOrder(orderExpected);
        orderRepository.add(OrderMother.random(orderExpected.toPrimitives()));
      }

      beforeEach(startScenario);

      it('should persist the order but not change the status', async () => {
        await handler.execute(command);

        const orderStored = orderRepository.stored();
        expect(orderRepository.storedChanged()).toBeTruthy();
        expect(orderStored).toHaveLength(1);
        expect(orderStored[0].toPrimitives()).toEqual({
          ...orderExpected.toPrimitives(),
          status: statusExpected,
        });
      });

      it('should not publish any event', async () => {
        await handler.execute(command);

        expect(eventBus.domainEvents()).toHaveLength(0);
      });
    });

    describe('When the seller trying to change the status', () => {
      let command: ChangeOrderStatusCommand;
      let orderExpected: Order;
      let statusExpected: string;

      function startScenario() {
        command = ChangeOrderStatusCommandMother.withStatusAccepted();
        statusExpected = OrderStatusMother.accepted().toString();
        orderExpected =
          OrderMother.fromChangeOrderStatusCommandWithOrderStatusCreated(
            command,
          );

        orderRepository.add(OrderMother.random(orderExpected.toPrimitives()));
      }

      beforeEach(startScenario);

      it('should persist the order', async () => {
        await handler.execute(command);

        const orderStored = orderRepository.stored();
        expect(orderRepository.storedChanged()).toBeTruthy();
        expect(orderStored).toHaveLength(1);
        expect(orderStored[0].toPrimitives()).toEqual({
          ...orderExpected.toPrimitives(),
          status: statusExpected,
        });
      });

      it('should publish an event', async () => {
        await handler.execute(command);

        expect(eventBus.domainEvents()).toHaveLength(1);
        expect(eventBus.domainEvents()[0]).toBeInstanceOf(
          OrderStatusWasChangedEvent,
        );
      });
    });
  });
});
