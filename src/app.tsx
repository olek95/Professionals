import React, { Suspense } from 'react';
import { ModalProvider } from './components/common/modal/modal-provider';
import { ToastProvider } from './components/common/toast/toast-provider';
import TopBar from './components/top-bar/top-bar';

const App = (): JSX.Element => (
  <>
    <ToastProvider>
      <ModalProvider>
        <Suspense fallback='Loading'>
          <TopBar />
        </Suspense>
      </ModalProvider>
    </ToastProvider>
  </>
);
export default App;
