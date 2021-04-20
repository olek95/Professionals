import { Button } from '../../models/button/button';

export interface ModalProps {
  title: string;
  leftButtons: Button[];
  rightButtons: Button[];
}
