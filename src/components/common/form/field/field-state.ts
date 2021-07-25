import { FieldType } from './field-type';

export interface FieldState {
  className: string;
  error: string;
  type: FieldType;
}
