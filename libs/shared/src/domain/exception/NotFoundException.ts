import DomainException from './DomainException';

export default class NotFoundException extends DomainException {
  constructor(
    public message: string,
    public code: string,
  ) {
    super(message, code);
  }
}
