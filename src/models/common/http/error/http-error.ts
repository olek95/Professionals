import { HttpStatus } from '../status/http-status';

export interface HttpError {
  message: string;
  status: HttpStatus;
}
