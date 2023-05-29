import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import React from 'react';
import { Provider, ErrorBoundary } from '@rollbar/react'; // Provider imports 'rollbar'
import App from './App';
import ru from './locales/ru';

const runApp = async () => {
  const i18n = i18next.createInstance();
  await i18n
    .use(initReactI18next)
    .init({
      lng: 'ru',
      debug: false,
      resources: {
        ru,
      },
    });

  const rollbarConfig = {
    accessToken: '232722dad74c45de84eab0979b11707b',
    environment: 'testenv',
  };

  return (
    <I18nextProvider i18n={i18n}>
      <Provider config={rollbarConfig}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </Provider>
    </I18nextProvider>
  );
};

export default runApp;
