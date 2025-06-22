import { beforeEach, beforeAll, describe, expect, it } from 'vitest';
import { GetOrderDetailQueryHandler } from '../../../../../src/application/query/get-order-detail/GetOrderDetailQueryHandler';
import { OrderRepositoryMock } from '../../../domain/order/OrderRepositoryMock';
import { GetOrderDetailQuery } from '../../../../../src/application/query/get-order-detail/GetOrderDetailQuery';
import { GetOrderDetailQueryMother } from './GetOrderDetailQueryMother';
import InvalidArgumentException from '@app/shared/domain/exception/InvalidArgumentException';
import { OrderPrimitives } from '../../../../../src/domain/order/Order';
import { OrderMother } from '../../../domain/order/OrderMother';
import { OrderDoesNotExistsException } from '@app/shared/domain/order/OrderDoesNotExistsException';
import { OrderSellerForbiddenException } from '../../../../../src/domain/order/OrderSellerForbiddenException';

describe('Given a GetOrderDetailQueryHandler to handle', () => {
  let orderRepository: OrderRepositoryMock;
  let handler: GetOrderDetailQueryHandler;

  const prepareDependencies = () => {
    orderRepository = new OrderRepositoryMock();
  };

  const initHandler = () => {
    handler = new GetOrderDetailQueryHandler(orderRepository);
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

  describe('When the order id is invalid', () => {
    let query: GetOrderDetailQuery;

    function startScenario() {
      query = GetOrderDetailQueryMother.random({ id: '' });
    }

    beforeEach(startScenario);

    it('should thrown an exception', async () => {
      await expect(handler.execute(query)).rejects.toThrowError(
        InvalidArgumentException,
      );
    });
  });

  describe('When the seller id is invalid', () => {
    let query: GetOrderDetailQuery;

    function startScenario() {
      query = GetOrderDetailQueryMother.random({ sellerId: '' });
    }

    beforeEach(startScenario);

    it('should thrown an exception', async () => {
      await expect(handler.execute(query)).rejects.toThrowError(
        InvalidArgumentException,
      );
    });
  });

  describe('When the order does not exist', () => {
    let query: GetOrderDetailQuery;

    function startScenario() {
      query = GetOrderDetailQueryMother.random();
    }

    beforeEach(startScenario);

    it('should thrown an exception', async () => {
      await expect(handler.execute(query)).rejects.toThrowError(
        OrderDoesNotExistsException,
      );
    });
  });

  describe('When an order is accessed by an external seller', () => {
    let query: GetOrderDetailQuery;

    function startScenario() {
      const order = OrderMother.random();

      query = GetOrderDetailQueryMother.random({
        id: order.toPrimitives().sellerId,
      });

      orderRepository.add(order);
    }

    beforeEach(startScenario);

    it('should thrown an exception', async () => {
      await expect(handler.execute(query)).rejects.toThrowError(
        OrderSellerForbiddenException,
      );
    });
  });

  describe('When the order exists', () => {
    let query: GetOrderDetailQuery;
    let orderExpected: OrderPrimitives;

    function startScenario() {
      const order = OrderMother.random();
      orderExpected = order.toPrimitives();
      query = GetOrderDetailQueryMother.random({
        id: orderExpected.id,
        sellerId: orderExpected.sellerId,
      });
      orderRepository.add(order);
    }

    beforeEach(startScenario);

    it('should get the order', async () => {
      const expected = await handler.execute(query);

      expect(expected.order).toEqual(orderExpected);
    });
  });
});
