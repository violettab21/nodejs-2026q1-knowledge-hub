import {
  UNAUTHORIZED_GENERAL_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from '../constants/constants';

export class UnauthorizedError extends Error {
  statusCode: number;
  errorText: string;

  constructor(message: string = UNAUTHORIZED_GENERAL_MESSAGE) {
    super(message);
    this.statusCode = 401;
    this.errorText = UNAUTHORIZED_MESSAGE;
  }
}
