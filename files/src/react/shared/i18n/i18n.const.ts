export enum Locale {
  ENGLISH = 'en',
  MALAY = 'ms',
  CHINESE_SIMPLIFIED = 'zh-Hans',
  CHINESE_TRADITIONAL = 'zh-Hant',
  TAMIL = 'ta',
}

export const LocaleName: Record<Locale, string> = {
  [Locale.ENGLISH]: 'English (Primary)',
  [Locale.MALAY]: 'Malay',
  [Locale.CHINESE_SIMPLIFIED]: 'Chinese Simplified',
  [Locale.CHINESE_TRADITIONAL]: 'Chinese Traditional',
  [Locale.TAMIL]: 'Tamil',
};
