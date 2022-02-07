import {Locale} from './i18n.const';

export type LocalizedOtp = 'localized' | 'raw';

export type LocalizedString<T extends LocalizedOtp = 'raw'> = T extends 'localized'
  ? string
  : Record<Locale.ENGLISH, string> & Partial<Record<Locale, string>>;
