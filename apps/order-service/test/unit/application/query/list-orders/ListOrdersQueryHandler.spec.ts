import { beforeEach, beforeAll, describe, expect, it } from 'vitest';
import { OrderRepositoryMock } from '../../../domain/order/OrderRepositoryMock';
import { ListOrdersQueryHandler } from '../../../../../src/application/query/list-orders/ListOrdersQueryHandler';
import { ListOrdersQuery } from '../../../../../src/application/query/list-orders/ListOrdersQuery';
import { ListOrdersQueryMother } from './ListOrdersQueryMother';
import { Order } from '../../../../../src/domain/order/Order';
import { OrderMother } from '../../../domain/order/OrderMother';
import InvalidArgumentException from '@app/shared/domain/exception/InvalidArgumentException';

describe('Given a ListOrdersQueryHandler to handle', () => {
  let orderRepository: OrderRepositoryMock;
  let handler: ListOrdersQueryHandler;

  const prepareDependencies = () => {
    orderRepository = new OrderRepositoryMock();
  };

  const initHandler = () => {
    handler = new ListOrdersQueryHandler(orderRepository);
  };

  const clean = () => {
    orderRepository.clean();
  };

  beforeAll(() => {
    prepareDependencies();
    initHandler();
  });

  beforeEach(() => {
    clean();
  });

  describe('When the seller id is invalid', () => {
    let query: ListOrdersQuery;

    function startScenario() {
      query = ListOrdersQueryMother.random('');
    }

    beforeEach(startScenario);

    it('should thrown an exception', async () => {
      await expect(handler.execute(query)).rejects.toThrowError(
        InvalidArgumentException,
      );
    });
  });

  describe('When not orders', () => {
    let query: ListOrdersQuery;

    function startScenario() {
      query = ListOrdersQueryMother.random();
    }

    beforeEach(startScenario);

    it('should get an empty result', async () => {
      const expected = await handler.execute(query);

      expect(expected.orders).toEqual([]);
    });
  });

  describe('When there are orders', () => {
    let query: ListOrdersQuery;
    let orderOne: Order;
    let orderTwo: Order;

    function startScenario() {
      query = ListOrdersQueryMother.random();

      orderOne = OrderMother.random();
      orderTwo = OrderMother.random();

      orderRepository.add(orderOne);
      orderRepository.add(orderTwo);
    }

    beforeEach(startScenario);

    it('should get a list of orders', async () => {
      const expected = await handler.execute(query);

      expect(expected.orders).toEqual([
        orderOne.toPrimitives(),
        orderTwo.toPrimitives(),
      ]);
    });
  });
});
