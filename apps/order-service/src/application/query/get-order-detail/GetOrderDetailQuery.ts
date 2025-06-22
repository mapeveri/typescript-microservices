export class GetOrderDetailQuery {
  constructor(
    public readonly orderId: string,
    public readonly sellerId: string,
  ) {}
}
