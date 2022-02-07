export class PermissionDeniedError extends Error {
  constructor() {
    super('Permission Denied');
    Object.setPrototypeOf(this, PermissionDeniedError.prototype);
  }
}
