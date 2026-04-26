export class UnauthorizedError extends Error {
  statusCode: number;
  errorText: string;

  constructor(message: string = 'User is unauthorized') {
    super(message);
    this.statusCode = 401;
    this.errorText = 'Unauthorized';
  }
}
