export enum OptInOptions {
  OPT_IN = 'opt-in',
  OPT_OUT = 'opt-out',
}

type OptionTranslation = {
  name: string;
  className: string;
};

export const OptInOptionsName = new Map<OptInOptions, OptionTranslation>([
  [OptInOptions.OPT_IN, {name: 'Opt in', className: 'text-success-500'}],
  [OptInOptions.OPT_OUT, {name: 'Opt out', className: 'text-error-500'}],
]);
