import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { store } from '@/store';
import App from './App';
import './index.css';

// Create a wrapper component that initializes auth
const AppWrapper = () => {
  return <App />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <AppWrapper />
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);
