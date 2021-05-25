import React, {Suspense} from 'react';
import TopBar from './components/top-bar/top-bar';
import {ModalProvider} from './components/common/modal/modal-provider';
import {ToastProvider} from "./components/common/toast/toast-provider";

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
