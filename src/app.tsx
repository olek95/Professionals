import { Suspense } from 'react';
import TopBar from './components/top-bar/top-bar';
import { ModalProvider } from './components/common/modal-provider';

const App = () => (
  <ModalProvider>
    <Suspense fallback='Loading'>
      <TopBar />
    </Suspense>
  </ModalProvider>
);
export default App;
