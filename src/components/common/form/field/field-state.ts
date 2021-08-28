import { FieldType } from './field-type';

export interface FieldState {
  className: string;
  errors: string;
  originType: FieldType;
  type: FieldType;
  validators: ((value: string) => string)[];
}
