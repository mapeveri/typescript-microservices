export default class CreateOrderCommand {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly customerId: string,
    public readonly sellerId: string,
    public readonly price: number,
    public readonly quantity: number,
  ) {}
}
