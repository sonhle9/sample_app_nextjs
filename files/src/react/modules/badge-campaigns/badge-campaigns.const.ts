import {ILocale, IUnlockBy} from './badge-campaigns.type';

export const LOCALES = ['en', 'ms', 'ta', 'zh-Hans', 'zh-Hant'] as const;

export const LOCALE_TABS: Array<{key: ILocale; label: string}> = [
  {key: 'en', label: 'English (Primary)'},
  {key: 'ms', label: 'Malay'},
  {key: 'zh-Hant', label: 'Chinese (Traditional)'},
  {key: 'zh-Hans', label: 'Chinese (Simplified)'},
  {key: 'ta', label: 'Tamil'},
];

export const UNLOCK_BY = ['MANUAL', 'CAMPAIGN'] as const;
export const UNLOCK_OPTIONS: Array<{label: string; value: IUnlockBy}> = [
  {label: 'Manual verification', value: 'MANUAL'},
  {label: 'Completing a reward campaign', value: 'CAMPAIGN'},
];
