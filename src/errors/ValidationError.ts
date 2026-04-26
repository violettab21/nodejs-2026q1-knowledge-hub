import {
  BAD_REQUEST_MESSAGE,
  BAD_REQUEST_GENERAL_MESSAGE,
} from '../constants/constants';

export class ValidationError extends Error {
  statusCode: number;
  errorText: string;

  constructor(message: string = BAD_REQUEST_GENERAL_MESSAGE) {
    super(message);
    this.statusCode = 400;
    this.errorText = BAD_REQUEST_MESSAGE;
  }
}
