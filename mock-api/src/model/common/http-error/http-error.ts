import { HttpStatus } from '../http-status/http-status.enum';

export interface HttpError {
  message: string;
  status: HttpStatus;
}
