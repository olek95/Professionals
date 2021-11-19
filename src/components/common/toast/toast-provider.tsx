import {
  createFactory,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { ToastContainer, ToastMessageAnimated } from 'react-toastr';
import { ToastContext } from './toast-context';
import './toast.scss';

export const ToastProvider = (props: PropsWithChildren<{}>): JSX.Element => {
  const [toast, setToast] = useState<ToastContainer>();
  const onToastMounted = useCallback(
    (toast: ToastContainer) => setToast(toast),
    []
  );
  const toastMessageFactory = useMemo(
    () => (props: any) => <ToastMessageAnimated {...props} />,
    []
  );
  return (
    <ToastContext.Provider value={toast}>
      <ToastContainer
        className='toast-provider-container'
        toastMessageFactory={toastMessageFactory}
        ref={onToastMounted}
      />
      {props.children}
    </ToastContext.Provider>
  );
};
