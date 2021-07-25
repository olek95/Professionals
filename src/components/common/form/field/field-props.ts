import { FieldType } from './field-type';

export interface FieldProps {
  className?: string;
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: FieldType;
  value: string;
}
