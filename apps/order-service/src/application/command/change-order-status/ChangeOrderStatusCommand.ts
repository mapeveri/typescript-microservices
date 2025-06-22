export class ChangeOrderStatusCommand {
  constructor(
    public readonly id: string,
    public readonly sellerId: string,
    public readonly status: string,
  ) {}
}
