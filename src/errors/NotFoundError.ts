export class NotFoundError extends Error {
  statusCode: number;
  errorText: string;

  constructor(message: string = 'Entity is not found') {
    super(message);
    this.statusCode = 404;
    this.errorText = 'Not Found';
  }
}
