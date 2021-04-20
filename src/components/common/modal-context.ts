import React from 'react';
import { ModalContextProps } from './modal-context-props';

export const ModalContext = React.createContext<ModalContextProps<any>>({
  configure: () => undefined,
  update: () => undefined,
});
