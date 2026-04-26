import {
  NOT_FOUND_MESSAGE,
  NOT_FOUND_GENERAL_MESSAGE,
} from '../constants/constants';

export class NotFoundError extends Error {
  statusCode: number;
  errorText: string;

  constructor(message: string = NOT_FOUND_GENERAL_MESSAGE) {
    super(message);
    this.statusCode = 404;
    this.errorText = NOT_FOUND_MESSAGE;
  }
}
