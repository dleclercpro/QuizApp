import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import { DEBUG_I18N, SERVER_ROOT } from './config';
import { Language, QUIZ_NAMES } from './constants';

export const INIT_LANGUAGE = Language.DE;
export const FALLBACK_LANGUAGE = Language.EN;

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    debug: DEBUG_I18N,
    lng: INIT_LANGUAGE,
    fallbackLng: FALLBACK_LANGUAGE,
    ns: ['common', ...QUIZ_NAMES],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: `${SERVER_ROOT}/static/locales/{{lng}}/{{ns}}.json`,
    },
  });

export default i18n;