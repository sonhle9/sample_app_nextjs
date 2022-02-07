import {titleCase} from '@setel/portal-ui';

export function convertToOptions(obj: any, options?: {hideOptionAll: boolean}) {
  const iterator = Object.keys(obj).map((key) => ({
    label: titleCase(obj[key], {hasUnderscore: true}),
    value: obj[key],
  }));

  if (!options?.hideOptionAll) {
    return [
      {
        label: 'All',
        value: '',
      },
    ].concat(iterator);
  }

  return iterator;
}
