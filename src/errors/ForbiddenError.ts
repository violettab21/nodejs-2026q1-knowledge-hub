export class ForbiddenError extends Error {
  statusCode: number;
  errorText: string;

  constructor(message: string = 'Action is forbidden') {
    super(message);
    this.statusCode = 403;
    this.errorText = 'Forbidden';
  }
}
