import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { persistor, store } from './stores/store';
import { ENV } from './utils/env';
import { setLogLevel } from './utils/logging';
import App from './App';
import './index.scss';
import './i18n';
import { PersistGate } from 'redux-persist/integration/react';
import { DEBUG } from './config';
import { TimerContextProvider } from './components/contexts/TimerContext';

setLogLevel(ENV);

if (DEBUG) {
  console.log(`Debug mode: active.`);
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Suspense>
            <TimerContextProvider>
              <App />
            </TimerContextProvider>
          </Suspense>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);