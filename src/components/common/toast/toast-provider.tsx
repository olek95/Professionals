import { ToastContext } from './toast-context';
import { ToastContainer, ToastMessageAnimated } from 'react-toastr';
import {
  createFactory,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import './toast.scss';

export const ToastProvider = (props: PropsWithChildren<{}>): JSX.Element => {
  const [toast, setToast] = useState<ToastContainer>();
  const onToastMounted = useCallback(
    (toast: ToastContainer) => setToast(toast),
    []
  );
  const toastMessageFactory = useMemo(
    () => createFactory(ToastMessageAnimated),
    []
  );
  return (
    <ToastContext.Provider value={toast}>
      <ToastContainer
        className='toast-provider-container'
        toastMessageFactory={toastMessageFactory}
        ref={onToastMounted}
      ></ToastContainer>
      {props.children}
    </ToastContext.Provider>
  );
};
