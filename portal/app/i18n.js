/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 */
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
// import deLocaleData from 'react-intl/locale-data/de';
import zhLocaleData from 'react-intl/locale-data/zh';
// import zhLocaleData from 'react-intl/locale-data/zh-hant';

// import LocaleData from 'react-intl/locale-data/de';

import { DEFAULT_LOCALE } from '../app/containers/App/constants';

import enTranslationMessages from './translations/en.json';
// import deTranslationMessages from './translations/de.json';
import twTranslationMessages from './translations/zh-Hans.json';
import zhTranslationMessages from './translations/zh.json';

addLocaleData(enLocaleData);
// addLocaleData(deLocaleData);
addLocaleData(zhLocaleData);

export const appLocales = ['en', 'zh', 'zh-Hans'];

export const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages =
    locale !== DEFAULT_LOCALE ? formatTranslationMessages(DEFAULT_LOCALE, zhTranslationMessages) : {};
  return Object.keys(messages).reduce((formattedMessages, key) => {
    const formattedMessage = !messages[key] && locale !== DEFAULT_LOCALE ? defaultFormattedMessages[key] : messages[key];
    return Object.assign(formattedMessages, { [key]: formattedMessage });
  }, {});
};

export const translationMessages = {
  en: formatTranslationMessages('en', enTranslationMessages),
  'zh-Hans': formatTranslationMessages('zh-Hans', twTranslationMessages),
  zh: formatTranslationMessages('zh', zhTranslationMessages),
};
