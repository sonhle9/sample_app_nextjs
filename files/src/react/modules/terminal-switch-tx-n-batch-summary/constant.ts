import {DATE_RANGES} from '@setel/portal-ui';

export const DEFAULT_COL_CLASSNAME = 'w-56 align-middle content-center self-center';

export const DATE_RANGE_OPTIONS_WITHOUT_ANY = [
  {
    label: 'Today',
    value: DATE_RANGES.today,
  },
  {
    label: 'Yesterday',
    value: DATE_RANGES.yesterday,
  },
  {
    label: 'Last 7 days',
    value: DATE_RANGES.last7days,
  },
  {
    label: 'Last 30 days',
    value: DATE_RANGES.last30days,
  },
];
