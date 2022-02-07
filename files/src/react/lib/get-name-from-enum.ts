import {titleCase} from '@setel/portal-ui';

export const getNameFromEnum = (
  val: string | undefined,
  e: Record<string, string>,
  toUpperCase?: boolean,
) => {
  const keyVal = Object.entries(e).find((enumVal) => enumVal.includes(val || '')) || ['', ''];
  if (toUpperCase) {
    return titleCase(keyVal[0], {hasUnderscore: true}).toUpperCase();
  }
  return titleCase(keyVal[0], {hasUnderscore: true});
};
