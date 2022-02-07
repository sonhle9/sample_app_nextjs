import {Locale} from './i18n.const';

export const forLocale = <T>(fn: (locale: Locale) => T) =>
  Object.values(Locale)
    .map((locale) => [locale, fn(locale)])
    .reduce((acc, [key, value]) => ({...acc, [key.toString()]: value}), {});
