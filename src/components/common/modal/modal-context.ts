import React from 'react';
import { ModalContextProps } from './modal-context-props';

export const ModalContext = React.createContext<ModalContextProps<any>>({
  close: () => {},
  configure: () => undefined,
  update: () => undefined,
});
