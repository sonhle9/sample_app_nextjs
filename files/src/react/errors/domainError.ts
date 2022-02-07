export class DomainError<T> extends Error {
  public domainError: boolean;

  constructor(public data: T) {
    super('Domain Error');
    this.domainError = true;
  }
}
