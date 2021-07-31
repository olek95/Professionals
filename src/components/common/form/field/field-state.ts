import { FieldType } from './field-type';

export interface FieldState {
  className: string;
  errors: string;
  type: FieldType;
}
