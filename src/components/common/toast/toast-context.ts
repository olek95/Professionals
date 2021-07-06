import React from 'react';
import { ToastContainer } from 'react-toastr';

export const ToastContext = React.createContext<ToastContainer | undefined>(
  undefined
);
