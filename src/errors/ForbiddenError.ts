import {
  FORBIDDEN_GENERAL_MESSAGE,
  FORBIDDEN_MESSAGE,
} from '../constants/constants';

export class ForbiddenError extends Error {
  statusCode: number;
  errorText: string;

  constructor(message: string = FORBIDDEN_GENERAL_MESSAGE) {
    super(message);
    this.statusCode = 403;
    this.errorText = FORBIDDEN_MESSAGE;
  }
}
