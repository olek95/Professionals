import { ComponentType } from 'react';
import { Button } from '../../../models/common/button/button';

export interface ModalConfiguration<T> {
  body: ComponentType<T>;
  bodyParams: T;
  leftButtons: Button[];
  onCancel?: () => void;
  onEnterPressed?: () => void;
  rightButtons: Button[];
  title: string;
}
