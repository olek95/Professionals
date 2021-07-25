import { Button } from '../../../models/common/button/button';

export interface ModalProps {
  close: () => void;
  leftButtons: Button[];
  rightButtons: Button[];
  title: string;
}
