import DomainException from './DomainException';

export default class ConflictException extends DomainException {
  constructor(
    public message: string,
    public code: string,
  ) {
    super(message, code);
  }
}
