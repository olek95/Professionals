import { HttpStatus } from '../status/http-status.enum';

export interface HttpError {
  message: string;
  status: HttpStatus;
}
