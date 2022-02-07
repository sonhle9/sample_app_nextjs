import * as L from 'lodash';
import {csvToJSON} from '../../shared/helpers/file';

export const parseCodesFile = (csv) => {
  const parsedCsv = csvToJSON(csv);
  const codes = parsedCsv.map(({code}) => code).filter((code) => !!code);

  const errors = [];

  if (!codes.length) {
    errors.push('File should contain column with name `code`');
  }
  if (codes.length !== L.uniq(codes).length) {
    errors.push('File has duplicates codes');
  }

  if (errors.length) {
    throw errors;
  }

  return codes;
};
