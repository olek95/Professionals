import { Dispatch, SetStateAction } from 'react';
import { ModalConfiguration } from './modal-configuration';

export interface ModalContextProps<T> {
  configure: Dispatch<SetStateAction<ModalConfiguration<T> | undefined>>;
  update: Dispatch<
    SetStateAction<Partial<ModalConfiguration<Partial<T>>> | undefined>
  >;
}
