import { Button } from '../../models/button/button';

export interface ModalProps {
  close: () => void;
  leftButtons: Button[];
  rightButtons: Button[];
  title: string;
}
