import { ComponentType } from 'react';
import { ModalProps } from './modal-props';

export interface ModalConfiguration<T> extends ModalProps {
  bodyParams: T;
  body: ComponentType<T>;
}
