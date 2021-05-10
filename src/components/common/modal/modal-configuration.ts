import { ComponentType } from 'react';
import { Button } from '../../../models/button/button';

export interface ModalConfiguration<T> {
  body: ComponentType<T>;
  bodyParams: T;
  leftButtons: Button[];
  onEscPressed?: () => void;
  onEnterPressed?: () => void;
  rightButtons: Button[];
  title: string;
}
