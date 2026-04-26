export class ValidationError extends Error {
  statusCode: number;
  errorText: string;

  constructor(message: string = 'Validation failed') {
    super(message);
    this.statusCode = 400;
    this.errorText = 'Bad Request';
  }
}
